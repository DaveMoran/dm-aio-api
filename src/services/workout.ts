import { getSupabase } from '../lib/supabase.js'
import type { WorkoutPlan, WorkoutScheduleItem, WorkoutCompletion, WorkoutProgramExercise, WorkoutExerciseCompletion } from '../schemas/workout.js'

function dateForWeekDay(startDate: string, weekNumber: number, dayOfWeek: number): string {
  const start = new Date(startDate + 'T00:00:00Z')
  const offset = (weekNumber - 1) * 7 + dayOfWeek
  const d = new Date(start)
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toISOString().split('T')[0]
}

export const workoutService = {
  async getActivePlan(): Promise<WorkoutPlan | null> {
    const { data, error } = await getSupabase()
      .from('workout_plans')
      .select('*')
      .eq('active', true)
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(error.message)
    }
    return data as WorkoutPlan
  },

  async getWeekSummaries(planId: string, userId: string): Promise<{ week_number: number; total: number; completed: number }[]> {
    const { data: items, error: itemsError } = await getSupabase()
      .from('workout_schedule_items')
      .select('id, week_number')
      .eq('plan_id', planId)

    if (itemsError) throw new Error(itemsError.message)

    const { data: completions, error: compError } = await getSupabase()
      .from('workout_completions')
      .select('schedule_item_id')
      .eq('user_id', userId)

    if (compError) throw new Error(compError.message)

    const completedSet = new Set((completions ?? []).map(c => c.schedule_item_id))

    const weekMap = new Map<number, { total: number; completed: number }>()
    for (const item of items ?? []) {
      const entry = weekMap.get(item.week_number) ?? { total: 0, completed: 0 }
      entry.total++
      if (completedSet.has(item.id)) entry.completed++
      weekMap.set(item.week_number, entry)
    }

    return Array.from(weekMap.entries())
      .map(([week_number, counts]) => ({ week_number, ...counts }))
      .sort((a, b) => a.week_number - b.week_number)
  },

  async getWeekSchedule(planId: string, weekNumber: number): Promise<WorkoutScheduleItem[]> {
    const { data, error } = await getSupabase()
      .from('workout_schedule_items')
      .select('*')
      .eq('plan_id', planId)
      .eq('week_number', weekNumber)
      .order('day_of_week')
      .order('sort_order')

    if (error) throw new Error(error.message)
    return data as WorkoutScheduleItem[]
  },

  async getCompletionsForWeek(planId: string, weekNumber: number, userId: string, startDate: string): Promise<WorkoutCompletion[]> {
    const weekStart = dateForWeekDay(startDate, weekNumber, 0)
    const weekEnd = dateForWeekDay(startDate, weekNumber, 6)

    const { data: itemIds, error: itemError } = await getSupabase()
      .from('workout_schedule_items')
      .select('id')
      .eq('plan_id', planId)
      .eq('week_number', weekNumber)

    if (itemError) throw new Error(itemError.message)
    if (!itemIds || itemIds.length === 0) return []

    const { data, error } = await getSupabase()
      .from('workout_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', weekStart)
      .lte('date', weekEnd)
      .in('schedule_item_id', itemIds.map(i => i.id))

    if (error) throw new Error(error.message)
    return data as WorkoutCompletion[]
  },

  async toggleItemCompletion(scheduleItemId: string, date: string, complete: boolean, userId: string): Promise<WorkoutCompletion | null> {
    if (complete) {
      const { data, error } = await getSupabase()
        .from('workout_completions')
        .upsert(
          { schedule_item_id: scheduleItemId, date, user_id: userId },
          { onConflict: 'schedule_item_id,date,user_id' },
        )
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as WorkoutCompletion
    } else {
      const { error } = await getSupabase()
        .from('workout_completions')
        .delete()
        .eq('schedule_item_id', scheduleItemId)
        .eq('date', date)
        .eq('user_id', userId)
      if (error) throw new Error(error.message)
      return null
    }
  },

  async getExercisesForItem(scheduleItemId: string): Promise<WorkoutProgramExercise[]> {
    const { data, error } = await getSupabase()
      .from('workout_program_exercises')
      .select('*')
      .eq('schedule_item_id', scheduleItemId)
      .order('sort_order')

    if (error) throw new Error(error.message)
    return data as WorkoutProgramExercise[]
  },

  async getExerciseCompletionsForWeek(_planId: string, weekNumber: number, userId: string, startDate: string): Promise<WorkoutExerciseCompletion[]> {
    const weekStart = dateForWeekDay(startDate, weekNumber, 0)
    const weekEnd = dateForWeekDay(startDate, weekNumber, 6)

    const { data, error } = await getSupabase()
      .from('workout_exercise_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', weekStart)
      .lte('date', weekEnd)

    if (error) throw new Error(error.message)
    return data as WorkoutExerciseCompletion[]
  },

  async toggleExerciseCompletion(exerciseId: string, date: string, complete: boolean, userId: string): Promise<WorkoutExerciseCompletion | null> {
    if (complete) {
      const { data, error } = await getSupabase()
        .from('workout_exercise_completions')
        .upsert(
          { exercise_id: exerciseId, date, user_id: userId },
          { onConflict: 'exercise_id,date,user_id' },
        )
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as WorkoutExerciseCompletion
    } else {
      const { error } = await getSupabase()
        .from('workout_exercise_completions')
        .delete()
        .eq('exercise_id', exerciseId)
        .eq('date', date)
        .eq('user_id', userId)
      if (error) throw new Error(error.message)
      return null
    }
  },
}

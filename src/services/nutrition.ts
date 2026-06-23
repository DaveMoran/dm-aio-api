import { getSupabase } from '../lib/supabase.js'
import type { SaveLogInput } from '../schemas/nutrition.js'

const ACTIVE_PLAN_ID = 'bbbbbbbb-0000-0000-0000-000000000001'

export const nutritionService = {
  async getAllTargets() {
    const { data, error } = await getSupabase()
      .from('meal_plan_targets')
      .select('day_of_week, calories_min, calories_max, protein_min, protein_max, carbs_min, carbs_max, fat_min, fat_max')
      .eq('plan_id', ACTIVE_PLAN_ID)
      .order('day_of_week')

    if (error) throw new Error(error.message)
    return data ?? []
  },

  async saveAllTargets(targets: { day_of_week: number; calories_min: number; calories_max: number; protein_min: number; protein_max: number; carbs_min: number; carbs_max: number; fat_min: number; fat_max: number }[]) {
    const rows = targets.map((t) => ({ ...t, plan_id: ACTIVE_PLAN_ID }))
    const { error } = await getSupabase()
      .from('meal_plan_targets')
      .upsert(rows, { onConflict: 'plan_id,day_of_week' })

    if (error) throw new Error(error.message)
  },

  async getLogForDate(userId: string, date: string) {
    const { data, error } = await getSupabase()
      .from('macro_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data
  },

  async saveLog(userId: string, date: string, values: SaveLogInput) {
    const { error } = await getSupabase()
      .from('macro_logs')
      .upsert(
        { date, ...values, user_id: userId, logged_at: new Date().toISOString() },
        { onConflict: 'date,user_id' },
      )

    if (error) throw new Error(error.message)
  },
}

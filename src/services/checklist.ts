import { getSupabase } from '../lib/supabase.js'
import type { Task, CreateTaskInput } from '../schemas/checklist.js'

function todayUTC(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

export const checklistService = {
  async getTasks(date: string, userId: string): Promise<{ morning: Task[]; evening: Task[] }> {
    const { data: taskRows, error: taskError } = await getSupabase()
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .lte('created_at', `${date}T23:59:59.999Z`)
      .or(`deleted_at.is.null,deleted_at.gt.${date}T23:59:59.999Z`)
      .order('sort_order', { ascending: true })

    if (taskError) throw new Error(taskError.message)

    const taskIds = (taskRows ?? []).map((t) => t.id)
    let completedIds = new Set<string>()

    if (taskIds.length > 0) {
      const { data: completions, error: compError } = await getSupabase()
        .from('task_completions')
        .select('task_id')
        .eq('date', date)
        .in('task_id', taskIds)

      if (compError) throw new Error(compError.message)
      completedIds = new Set((completions ?? []).map((c) => c.task_id))
    }

    const tasks: Task[] = (taskRows ?? []).map((t) => ({
      ...t,
      completed: completedIds.has(t.id),
    }))

    const morning = tasks.filter((t) => t.period === 'AM')
    const evening = tasks.filter((t) => t.period === 'PM')
    return { morning, evening }
  },

  async createTask(data: CreateTaskInput, userId: string): Promise<Task> {
    const { data: created, error } = await getSupabase()
      .from('tasks')
      .insert({ ...data, user_id: userId })
      .select()
      .single()

    if (error) throw new Error(error.message)
    if (!created) throw new Error('Insert returned no data')
    return { ...created, completed: false } as Task
  },

  async toggleTask(id: string, completed: boolean, date: string, userId: string): Promise<Task | null> {
    const { data: task, error: fetchError } = await getSupabase()
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .lte('created_at', `${date}T23:59:59.999Z`)
      .or(`deleted_at.is.null,deleted_at.gt.${date}T23:59:59.999Z`)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return null
      throw new Error(fetchError.message)
    }

    if (completed) {
      const { error } = await getSupabase()
        .from('task_completions')
        .upsert({ task_id: id, date }, { onConflict: 'task_id,date' })
      if (error) throw new Error(error.message)
    } else {
      const { error } = await getSupabase()
        .from('task_completions')
        .delete()
        .eq('task_id', id)
        .eq('date', date)
      if (error) throw new Error(error.message)
    }

    return { ...task, completed, deleted_at: task.deleted_at ?? null } as Task
  },

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const { data, error } = await getSupabase()
      .from('tasks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .select('id')

    if (error) throw new Error(error.message)
    return (data ?? []).length > 0
  },

  todayUTC,
}

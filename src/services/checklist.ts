import { supabase } from '../lib/supabase.js'
import type { Task, CreateTaskInput, UpdateTaskInput } from '../schemas/checklist.js'

export const checklistService = {
  async getTasks(): Promise<{ morning: Task[]; evening: Task[] }> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw new Error(error.message)

    const morning = (data ?? []).filter((t) => t.period === 'AM') as Task[]
    const evening = (data ?? []).filter((t) => t.period === 'PM') as Task[]
    return { morning, evening }
  },

  async createTask(data: CreateTaskInput): Promise<Task> {
    const { data: created, error } = await supabase
      .from('tasks')
      .insert(data)
      .select()
      .single()

    if (error) throw new Error(error.message)
    if (!created) throw new Error('Insert returned no data')
    return created as Task
  },

  async updateTask(id: string, data: UpdateTaskInput): Promise<Task | null> {
    const { data: updated, error } = await supabase
      .from('tasks')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      // PostgREST returns PGRST116 when no rows matched
      if (error.code === 'PGRST116') return null
      throw new Error(error.message)
    }
    return updated as Task
  },

  async deleteTask(id: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .select('id')

    if (error) throw new Error(error.message)
    return (data ?? []).length > 0
  },
}

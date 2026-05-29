import { supabase } from '../lib/supabase.js'
import type { DayTargets, MacroLog, SaveLogInput } from '../schemas/nutrition.js'

const ACTIVE_PLAN_ID = 'bbbbbbbb-0000-0000-0000-000000000001'

const TARGET_COLUMNS =
  'day_of_week, calories_min, calories_max, protein_min, protein_max, carbs_min, carbs_max, fat_min, fat_max'

export const nutritionService = {
  async getAllTargets(): Promise<DayTargets[]> {
    const { data, error } = await supabase
      .from('meal_plan_targets')
      .select(TARGET_COLUMNS)
      .eq('plan_id', ACTIVE_PLAN_ID)
      .order('day_of_week')
    if (error) throw new Error(error.message)
    return (data ?? []) as DayTargets[]
  },

  async saveAllTargets(targets: DayTargets[]): Promise<DayTargets[]> {
    const rows = targets.map((t) => ({ ...t, plan_id: ACTIVE_PLAN_ID }))
    const { data, error } = await supabase
      .from('meal_plan_targets')
      .upsert(rows, { onConflict: 'plan_id,day_of_week' })
      .select(TARGET_COLUMNS)
      .order('day_of_week')
    if (error) throw new Error(error.message)
    return (data ?? []) as DayTargets[]
  },

  async getLogForDate(date: string): Promise<MacroLog | null> {
    const { data, error } = await supabase
      .from('macro_logs')
      .select('*')
      .eq('date', date)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return (data as MacroLog) ?? null
  },

  async saveLog(date: string, values: SaveLogInput): Promise<MacroLog> {
    const { data, error } = await supabase
      .from('macro_logs')
      .upsert(
        { date, ...values, logged_at: new Date().toISOString() },
        { onConflict: 'date' },
      )
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as MacroLog
  },
}

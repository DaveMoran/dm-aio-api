import { z } from 'zod'

export const DayTargetsSchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  calories_min: z.number(),
  calories_max: z.number(),
  protein_min: z.number(),
  protein_max: z.number(),
  carbs_min: z.number(),
  carbs_max: z.number(),
  fat_min: z.number(),
  fat_max: z.number(),
})

export const MacroLogSchema = z.object({
  id: z.string().uuid(),
  date: z.string().date(),
  calories: z.number().nullable(),
  protein: z.number().nullable(),
  carbs: z.number().nullable(),
  fat: z.number().nullable(),
  logged_at: z.string().datetime(),
})

export type DayTargets = z.infer<typeof DayTargetsSchema>
export type MacroLog = z.infer<typeof MacroLogSchema>

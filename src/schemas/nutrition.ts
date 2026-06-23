import { z } from 'zod'

export const DayTargetsSchema = z
  .object({
    day_of_week: z.number().int().min(0).max(6),
    calories_min: z.number().int().min(0),
    calories_max: z.number().int().min(0),
    protein_min: z.number().int().min(0),
    protein_max: z.number().int().min(0),
    carbs_min: z.number().int().min(0),
    carbs_max: z.number().int().min(0),
    fat_min: z.number().int().min(0),
    fat_max: z.number().int().min(0),
  })
  .refine((d) => d.calories_min <= d.calories_max, { message: 'calories_min must be ≤ calories_max' })
  .refine((d) => d.protein_min <= d.protein_max, { message: 'protein_min must be ≤ protein_max' })
  .refine((d) => d.carbs_min <= d.carbs_max, { message: 'carbs_min must be ≤ carbs_max' })
  .refine((d) => d.fat_min <= d.fat_max, { message: 'fat_min must be ≤ fat_max' })

export const SaveTargetsSchema = z
  .array(DayTargetsSchema)
  .length(7)
  .refine(
    (arr) => new Set(arr.map((d) => d.day_of_week)).size === 7,
    { message: 'Each day_of_week (0–6) must appear exactly once' },
  )

export const SaveLogSchema = z.object({
  calories: z.number().int().min(0).nullable(),
  protein: z.number().int().min(0).nullable(),
  carbs: z.number().int().min(0).nullable(),
  fat: z.number().int().min(0).nullable(),
})

export type DayTargets = z.infer<typeof DayTargetsSchema>
export type SaveLogInput = z.infer<typeof SaveLogSchema>

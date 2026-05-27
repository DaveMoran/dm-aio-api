import { z } from 'zod'

export const WorkoutPlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  start_date: z.string().date(),
  total_weeks: z.number().int().positive(),
  active: z.boolean(),
  created_at: z.string().datetime(),
})

export const WorkoutScheduleItemSchema = z.object({
  id: z.string().uuid(),
  plan_id: z.string().uuid(),
  week_number: z.number().int().positive(),
  day_of_week: z.number().int().min(0).max(6),
  sort_order: z.number().int(),
  label: z.string().min(1),
  type: z.enum(['single', 'program']),
  category: z.enum(['run', 'strength', 'race', 'cross']),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
})

export const WorkoutProgramExerciseSchema = z.object({
  id: z.string().uuid(),
  schedule_item_id: z.string().uuid(),
  sort_order: z.number().int(),
  label: z.string().min(1),
  created_at: z.string().datetime(),
})

export const WorkoutCompletionSchema = z.object({
  id: z.string().uuid(),
  schedule_item_id: z.string().uuid(),
  date: z.string().date(),
  completed_at: z.string().datetime(),
})

export const WorkoutExerciseCompletionSchema = z.object({
  id: z.string().uuid(),
  exercise_id: z.string().uuid(),
  date: z.string().date(),
  completed_at: z.string().datetime(),
})

export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>
export type WorkoutScheduleItem = z.infer<typeof WorkoutScheduleItemSchema>
export type WorkoutProgramExercise = z.infer<typeof WorkoutProgramExerciseSchema>
export type WorkoutCompletion = z.infer<typeof WorkoutCompletionSchema>
export type WorkoutExerciseCompletion = z.infer<typeof WorkoutExerciseCompletionSchema>

import { z } from 'zod'

export const BootcampItemTypeSchema = z.enum(['read', 'write', 'code'])

export const BootcampItemSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  type: BootcampItemTypeSchema,
})

export const BootcampTaskSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  timeRange: z.string().optional(),
  type: BootcampItemTypeSchema,
})

export const BootcampBlockSchema = z.object({
  name: z.string().min(1),
  timeRange: z.string().min(1),
  tasks: z.array(BootcampTaskSchema),
})

export const BootcampHomeworkSchema = z.object({
  optional: z.boolean().optional(),
  note: z.string().optional(),
  questions: z.array(BootcampItemSchema),
})

export const BootcampExerciseSchema = z.object({
  number: z.number().int().positive(),
  title: z.string().min(1),
  timeEstimate: z.string().min(1),
  difficulty: z.string().min(1),
  acceptanceCriteria: z.array(BootcampItemSchema),
})

export const BootcampDaySchema = z.object({
  dow: z.number().int().min(0).max(6),
  name: z.string().min(1),
  shortName: z.string().min(1),
  fullDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hours: z.number().min(0),
  eveningNote: z.string().optional(),
  learningFocus: z.string().optional(),
  blocks: z.array(BootcampBlockSchema),
  homework: BootcampHomeworkSchema.optional(),
  exercises: z.array(BootcampExerciseSchema).optional(),
})

export const CurriculumBodySchema = z.object({
  acceptanceCriteria: z.array(BootcampItemSchema),
  days: z.array(BootcampDaySchema).min(1).max(7),
})

export const UpsertCurriculumSchema = z.object({
  title: z.string().min(1),
  focus: z.string().min(1),
  totalHours: z.number().int().positive(),
  dates: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  deliverable: z.string().min(1),
  curriculum: CurriculumBodySchema,
})

export const ToggleCompletionSchema = z.object({
  itemKey: z.string().min(1),
  complete: z.boolean(),
})

export const SaveContentSchema = z.object({
  content: z.string(),
})

export const BootcampCompletionSchema = z.object({
  id: z.string().uuid(),
  item_key: z.string().min(1),
  completed_at: z.string().datetime(),
})

export const BootcampContentSchema = z.object({
  item_key: z.string().min(1),
  content: z.string(),
  updated_at: z.string().datetime(),
})

export type BootcampCompletion = z.infer<typeof BootcampCompletionSchema>
export type BootcampContent = z.infer<typeof BootcampContentSchema>
export type UpsertCurriculum = z.infer<typeof UpsertCurriculumSchema>
export type CurriculumBody = z.infer<typeof CurriculumBodySchema>

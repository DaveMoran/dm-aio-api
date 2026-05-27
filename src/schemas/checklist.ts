import { z } from 'zod'

export const TaskSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  period: z.enum(['AM', 'PM']),
  sort_order: z.number().int(),
  created_at: z.string().datetime(),
})

export const TaskCompletionSchema = z.object({
  id: z.string().uuid(),
  task_id: z.string().uuid(),
  date: z.string().date(),
  completed_at: z.string().datetime(),
})

export type Task = z.infer<typeof TaskSchema>
export type TaskCompletion = z.infer<typeof TaskCompletionSchema>

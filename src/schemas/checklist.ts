import { z } from 'zod'

export const TaskSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  period: z.enum(['AM', 'PM']),
  sort_order: z.number().int(),
  completed: z.boolean(),
  created_at: z.string().datetime(),
})

export const CreateTaskSchema = z.object({
  name: z.string().min(1),
  period: z.enum(['AM', 'PM']),
  sort_order: z.number().int().min(1),
})

// At least one field required
export const UpdateTaskSchema = TaskSchema
  .pick({ name: true, period: true, sort_order: true, completed: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export const TaskCompletionSchema = z.object({
  id: z.string().uuid(),
  task_id: z.string().uuid(),
  date: z.string().date(),
  completed_at: z.string().datetime(),
})

export type Task = z.infer<typeof TaskSchema>
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>
export type TaskCompletion = z.infer<typeof TaskCompletionSchema>

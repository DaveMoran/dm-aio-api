import { z } from 'zod'

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

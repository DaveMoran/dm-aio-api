import { z } from 'zod'

export const ShoppingItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  category: z.enum(['Groceries', 'Productivity', 'Gifts']),
  completed: z.boolean(),
  created_at: z.string().datetime(),
})

export const TodoItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  priority: z.enum(['high', 'medium', 'low']).nullable(),
  due_date: z.string().date().nullable(),
  completed: z.boolean(),
  created_at: z.string().datetime(),
})

export type ShoppingItem = z.infer<typeof ShoppingItemSchema>
export type TodoItem = z.infer<typeof TodoItemSchema>

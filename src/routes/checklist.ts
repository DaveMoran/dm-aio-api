import { Hono } from 'hono'

export const checklistRouter = new Hono()

checklistRouter.get('/', (c) =>
  c.json({ message: 'checklist routes coming soon' }),
)

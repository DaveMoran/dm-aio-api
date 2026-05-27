import { Hono } from 'hono'

export const nutritionRouter = new Hono()

nutritionRouter.get('/', (c) =>
  c.json({ message: 'nutrition routes coming soon' }),
)

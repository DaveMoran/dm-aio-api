import { Hono } from 'hono'

export const workoutRouter = new Hono()

workoutRouter.get('/', (c) =>
  c.json({ message: 'workout routes coming soon' }),
)

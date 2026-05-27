import { Hono } from 'hono'

export const bootcampRouter = new Hono()

bootcampRouter.get('/', (c) =>
  c.json({ message: 'bootcamp routes coming soon' }),
)

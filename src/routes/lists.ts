import { Hono } from 'hono'

export const listsRouter = new Hono()

listsRouter.get('/', (c) =>
  c.json({ message: 'lists routes coming soon' }),
)

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { checklistService } from '../services/checklist.js'
import { CreateTaskSchema, UpdateTaskSchema } from '../schemas/checklist.js'

export const checklistRouter = new Hono()

const DateQuerySchema = z.object({
  date: z.string().date().optional(),
})

checklistRouter.get('/', zValidator('query', DateQuerySchema), async (c) => {
  const { date } = c.req.valid('query')
  const tasks = await checklistService.getTasks(date ?? checklistService.todayUTC())
  return c.json({ data: tasks })
})

checklistRouter.post(
  '/',
  zValidator('json', CreateTaskSchema),
  async (c) => {
    const body = c.req.valid('json')
    const task = await checklistService.createTask(body)
    return c.json({ data: task }, 201)
  },
)

checklistRouter.patch(
  '/:id',
  zValidator('json', UpdateTaskSchema),
  async (c) => {
    const id = c.req.param('id')
    const { completed, date } = c.req.valid('json')

    // Reject writes to any date other than today (server-enforced guard)
    if (date !== checklistService.todayUTC()) {
      return c.json({ error: 'Cannot modify historical data' }, 400)
    }

    const task = await checklistService.toggleTask(id, completed, date)
    if (!task) return c.json({ error: 'Task not found' }, 404)
    return c.json({ data: task })
  },
)

checklistRouter.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const deleted = await checklistService.deleteTask(id)
  if (!deleted) return c.json({ error: 'Task not found' }, 404)
  return new Response(null, { status: 204 })
})

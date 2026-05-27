import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { checklistService } from '../services/checklist.js'
import { CreateTaskSchema, UpdateTaskSchema } from '../schemas/checklist.js'

export const checklistRouter = new Hono()

checklistRouter.get('/', async (c) => {
  const tasks = await checklistService.getTasks()
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
    const body = c.req.valid('json')
    const task = await checklistService.updateTask(id, body)
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

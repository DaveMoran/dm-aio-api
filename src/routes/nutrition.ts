import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { nutritionService } from '../services/nutrition.js'
import { SaveTargetsSchema, SaveLogSchema } from '../schemas/nutrition.js'

const DateParam = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')

export const nutritionRouter = new Hono()

nutritionRouter.get('/targets', async (c) => {
  const targets = await nutritionService.getAllTargets()
  return c.json({ data: targets })
})

nutritionRouter.put(
  '/targets',
  zValidator('json', SaveTargetsSchema),
  async (c) => {
    const body = c.req.valid('json')
    const targets = await nutritionService.saveAllTargets(body)
    return c.json({ data: targets })
  },
)

nutritionRouter.get('/logs/:date', async (c) => {
  const parsed = DateParam.safeParse(c.req.param('date'))
  if (!parsed.success) return c.json({ error: 'Invalid date format, use YYYY-MM-DD' }, 400)
  const log = await nutritionService.getLogForDate(parsed.data)
  return c.json({ data: log })
})

nutritionRouter.put(
  '/logs/:date',
  zValidator('json', SaveLogSchema),
  async (c) => {
    const parsed = DateParam.safeParse(c.req.param('date'))
    if (!parsed.success) return c.json({ error: 'Invalid date format, use YYYY-MM-DD' }, 400)
    const body = c.req.valid('json')
    const log = await nutritionService.saveLog(parsed.data, body)
    return c.json({ data: log })
  },
)

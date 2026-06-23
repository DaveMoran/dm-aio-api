import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { nutritionService } from '../services/nutrition.js'
import { SaveTargetsSchema, SaveLogSchema } from '../schemas/nutrition.js'

export const nutritionRouter = new Hono<{ Variables: { userId: string } }>()

const DateParamSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
})

nutritionRouter.get('/targets', async (c) => {
  const data = await nutritionService.getAllTargets()
  return c.json({ data })
})

nutritionRouter.put('/targets', zValidator('json', SaveTargetsSchema), async (c) => {
  const targets = c.req.valid('json')
  await nutritionService.saveAllTargets(targets)
  return c.json({ data: targets })
})

nutritionRouter.get('/logs/:date', zValidator('param', DateParamSchema), async (c) => {
  const { date } = c.req.valid('param')
  const userId = c.get('userId')
  const log = await nutritionService.getLogForDate(userId, date)
  return c.json({ data: log })
})

nutritionRouter.put('/logs/:date', zValidator('param', DateParamSchema), zValidator('json', SaveLogSchema), async (c) => {
  const { date } = c.req.valid('param')
  const userId = c.get('userId')
  const values = c.req.valid('json')
  await nutritionService.saveLog(userId, date, values)
  return c.json({ data: { date, ...values } })
})

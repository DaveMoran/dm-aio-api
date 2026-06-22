import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { bootcampService } from '../services/bootcamp.js'
import { UpsertCurriculumSchema, ToggleCompletionSchema, SaveContentSchema } from '../schemas/bootcamp.js'

export const bootcampRouter = new Hono<{ Variables: { userId: string } }>()

// ── Curriculum ───────────────────────────────────────────────────────────────

bootcampRouter.get('/curriculum', async (c) => {
  const weeks = await bootcampService.listWeeks()
  return c.json({ data: weeks })
})

bootcampRouter.get(
  '/curriculum/:weekNumber',
  zValidator('param', z.object({ weekNumber: z.coerce.number().int().positive() })),
  async (c) => {
    const { weekNumber } = c.req.valid('param')
    const week = await bootcampService.getWeek(weekNumber)
    if (!week) return c.json({ error: 'Week not found' }, 404)
    return c.json({ data: week })
  },
)

bootcampRouter.put(
  '/curriculum/:weekNumber',
  zValidator('param', z.object({ weekNumber: z.coerce.number().int().positive() })),
  zValidator('json', UpsertCurriculumSchema),
  async (c) => {
    const { weekNumber } = c.req.valid('param')
    const body = c.req.valid('json')
    const week = await bootcampService.upsertWeek(weekNumber, body)
    return c.json({ data: week })
  },
)

// ── Completions ──────────────────────────────────────────────────────────────

bootcampRouter.get('/completions', async (c) => {
  const userId = c.get('userId')
  const completions = await bootcampService.getCompletions(userId)
  return c.json({ data: completions })
})

bootcampRouter.post(
  '/completions',
  zValidator('json', ToggleCompletionSchema),
  async (c) => {
    const userId = c.get('userId')
    const { itemKey, complete } = c.req.valid('json')
    await bootcampService.toggleCompletion(userId, itemKey, complete)
    return c.json({ data: { itemKey, complete } })
  },
)

// ── Content ──────────────────────────────────────────────────────────────────

bootcampRouter.get('/content', async (c) => {
  const userId = c.get('userId')
  const content = await bootcampService.getContent(userId)
  return c.json({ data: content })
})

bootcampRouter.put(
  '/content/:itemKey',
  zValidator('param', z.object({ itemKey: z.string().min(1) })),
  zValidator('json', SaveContentSchema),
  async (c) => {
    const userId = c.get('userId')
    const { itemKey } = c.req.valid('param')
    const { content } = c.req.valid('json')
    await bootcampService.saveContent(userId, itemKey, content)
    return c.json({ data: { itemKey, content } })
  },
)

// ── Report ───────────────────────────────────────────────────────────────────

bootcampRouter.get(
  '/report/:weekNumber',
  zValidator('param', z.object({ weekNumber: z.coerce.number().int().positive() })),
  async (c) => {
    const userId = c.get('userId')
    const { weekNumber } = c.req.valid('param')
    const report = await bootcampService.generateReport(userId, weekNumber)
    if (!report) return c.json({ error: 'Week not found' }, 404)
    return c.text(report)
  },
)

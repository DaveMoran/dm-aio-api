import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { workoutService } from '../services/workout.js'
import { ToggleCompletionSchema } from '../schemas/workout.js'

export const workoutRouter = new Hono<{ Variables: { userId: string } }>()

workoutRouter.get('/weeks', async (c) => {
  const userId = c.get('userId')
  const plan = await workoutService.getActivePlan()
  if (!plan) return c.json({ error: 'No active workout plan' }, 404)

  const weeks = await workoutService.getWeekSummaries(plan.id, userId)
  return c.json({
    data: {
      plan: { id: plan.id, name: plan.name, start_date: plan.start_date, total_weeks: plan.total_weeks },
      weeks,
    },
  })
})

workoutRouter.get(
  '/weeks/:weekNumber',
  zValidator('param', z.object({ weekNumber: z.coerce.number().int().min(0) })),
  async (c) => {
    const userId = c.get('userId')
    const { weekNumber } = c.req.valid('param')
    const plan = await workoutService.getActivePlan()
    if (!plan) return c.json({ error: 'No active workout plan' }, 404)

    const [items, completions, exerciseCompletions] = await Promise.all([
      workoutService.getWeekSchedule(plan.id, weekNumber),
      workoutService.getCompletionsForWeek(plan.id, weekNumber, userId, plan.start_date),
      workoutService.getExerciseCompletionsForWeek(plan.id, weekNumber, userId, plan.start_date),
    ])

    const programItems = items.filter(i => i.type === 'program')
    const exercisesByItem: Record<string, Awaited<ReturnType<typeof workoutService.getExercisesForItem>>> = {}
    if (programItems.length > 0) {
      const lists = await Promise.all(programItems.map(p => workoutService.getExercisesForItem(p.id)))
      programItems.forEach((p, idx) => { exercisesByItem[p.id] = lists[idx] })
    }

    const completedIds = new Set(completions.map(c => c.schedule_item_id))
    const exerciseCompletedIds = new Set(exerciseCompletions.map(c => c.exercise_id))

    const dayMap = new Map<number, typeof items>()
    for (const item of items) {
      const list = dayMap.get(item.day_of_week) ?? []
      list.push(item)
      dayMap.set(item.day_of_week, list)
    }

    const days = Array.from(dayMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([day_of_week, dayItems]) => ({
        day_of_week,
        items: dayItems.map(item => ({
          ...item,
          completed: completedIds.has(item.id),
          exercises: (exercisesByItem[item.id] ?? []).map(ex => ({
            ...ex,
            completed: exerciseCompletedIds.has(ex.id),
          })),
        })),
      }))

    return c.json({ data: { week_number: weekNumber, days } })
  },
)

workoutRouter.patch(
  '/completions/:scheduleItemId',
  zValidator('json', ToggleCompletionSchema),
  async (c) => {
    const scheduleItemId = c.req.param('scheduleItemId')
    const userId = c.get('userId')
    const { date, completed } = c.req.valid('json')

    const result = await workoutService.toggleItemCompletion(scheduleItemId, date, completed, userId)
    return c.json({ data: result })
  },
)

workoutRouter.patch(
  '/exercise-completions/:exerciseId',
  zValidator('json', ToggleCompletionSchema),
  async (c) => {
    const exerciseId = c.req.param('exerciseId')
    const userId = c.get('userId')
    const { date, completed } = c.req.valid('json')

    const result = await workoutService.toggleExerciseCompletion(exerciseId, date, completed, userId)
    return c.json({ data: result })
  },
)

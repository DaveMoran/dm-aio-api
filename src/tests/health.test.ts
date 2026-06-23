import { describe, expect, it, mock } from 'bun:test'

mock.module('../middleware/auth.js', () => ({
  authMiddleware: async (c: { set: (k: string, v: string) => void }, next: () => Promise<void>) => {
    c.set('userId', 'test-user-id')
    await next()
  },
}))

mock.module('../services/bootcamp.js', () => ({
  bootcampService: {
    listWeeks: async () => [],
    getWeek: async () => null,
    upsertWeek: async () => ({}),
    getCompletions: async () => [],
    toggleCompletion: async () => {},
    getContent: async () => [],
    saveContent: async () => {},
    generateReport: async () => null,
  },
}))

mock.module('../services/workout.js', () => ({
  workoutService: {
    getActivePlan: async () => ({
      id: 'test-plan-id',
      name: 'Test Plan',
      start_date: '2026-06-01',
      total_weeks: 27,
      active: true,
      created_at: '2026-06-01T00:00:00Z',
    }),
    getWeekSummaries: async () => [],
    getWeekSchedule: async () => [],
    getCompletionsForWeek: async () => [],
    getExercisesForItem: async () => [],
    getExerciseCompletionsForWeek: async () => [],
    toggleItemCompletion: async () => null,
    toggleExerciseCompletion: async () => null,
  },
}))

const { createApp } = await import('../app.js')

describe('GET /health', () => {
  const app = createApp()

  it('returns 200 with status ok', async () => {
    const req = new Request('http://localhost/health')
    const res = await app.fetch(req)

    expect(res.status).toBe(200)

    const body = (await res.json()) as { status: string; timestamp: string }
    expect(body.status).toBe('ok')
    expect(typeof body.timestamp).toBe('string')
  })
})

describe('Domain stub routes', () => {
  const app = createApp()

  const domains = ['lists', 'nutrition']

  for (const domain of domains) {
    it(`GET /api/v1/${domain} returns 200`, async () => {
      const req = new Request(`http://localhost/api/v1/${domain}`)
      const res = await app.fetch(req)

      expect(res.status).toBe(200)

      const body = (await res.json()) as { message: string }
      expect(body.message).toContain('coming soon')
    })
  }
})

describe('Workout routes', () => {
  const app = createApp()

  it('GET /api/v1/workout/weeks returns 200 with plan and weeks', async () => {
    const req = new Request('http://localhost/api/v1/workout/weeks')
    const res = await app.fetch(req)

    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: { plan: unknown; weeks: unknown[] } }
    expect(body.data).toHaveProperty('plan')
    expect(body.data).toHaveProperty('weeks')
    expect(Array.isArray(body.data.weeks)).toBe(true)
  })

  it('GET /api/v1/workout/weeks/1 returns 200 with week detail', async () => {
    const req = new Request('http://localhost/api/v1/workout/weeks/1')
    const res = await app.fetch(req)

    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: { week_number: number; days: unknown[] } }
    expect(body.data.week_number).toBe(1)
    expect(Array.isArray(body.data.days)).toBe(true)
  })
})

describe('Bootcamp curriculum routes', () => {
  const app = createApp()

  it('GET /api/v1/bootcamp/curriculum returns 200 with data array', async () => {
    const req = new Request('http://localhost/api/v1/bootcamp/curriculum')
    const res = await app.fetch(req)

    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: unknown[] }
    expect(Array.isArray(body.data)).toBe(true)
  })
})

describe('GET /api/v1/checklist', () => {
  const app = createApp()

  it('returns 200 with morning and evening keys', async () => {
    const req = new Request('http://localhost/api/v1/checklist')
    const res = await app.fetch(req)

    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: { morning: unknown[]; evening: unknown[] } }
    expect(body.data).toHaveProperty('morning')
    expect(body.data).toHaveProperty('evening')
  })
})

import { describe, expect, it, mock, beforeEach } from 'bun:test'

const mockGetAllTargets = mock(() => Promise.resolve([] as Record<string, unknown>[]))
const mockSaveAllTargets = mock(() => Promise.resolve())
const mockGetLogForDate = mock(() => Promise.resolve(null as Record<string, unknown> | null))
const mockSaveLog = mock(() => Promise.resolve())

mock.module('../middleware/auth.js', () => ({
  authMiddleware: async (c: { set: (k: string, v: string) => void }, next: () => Promise<void>) => {
    c.set('userId', 'test-user-id')
    await next()
  },
}))

mock.module('../services/nutrition.js', () => ({
  nutritionService: {
    getAllTargets: mockGetAllTargets,
    saveAllTargets: mockSaveAllTargets,
    getLogForDate: mockGetLogForDate,
    saveLog: mockSaveLog,
  },
}))

const { createApp } = await import('../app.js')
const app = createApp()

function json(body: unknown): RequestInit {
  return {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

function makeTargets(overrides?: Partial<{ day: number; cal_min: number; cal_max: number }>[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const o = overrides?.[i] ?? {}
    return {
      day_of_week: o.day ?? i,
      calories_min: o.cal_min ?? 2000,
      calories_max: o.cal_max ?? 2200,
      protein_min: 150,
      protein_max: 170,
      carbs_min: 200,
      carbs_max: 220,
      fat_min: 60,
      fat_max: 75,
    }
  })
}

// ── GET /targets ──────────────────────────────────────────────────────────────

describe('GET /api/v1/nutrition/targets', () => {
  beforeEach(() => mockGetAllTargets.mockReset())

  it('returns 200 with targets array', async () => {
    const targets = makeTargets()
    mockGetAllTargets.mockResolvedValueOnce(targets)

    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/targets'))
    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: unknown[] }
    expect(body.data).toEqual(targets)
  })

  it('returns 200 with empty array when no targets', async () => {
    mockGetAllTargets.mockResolvedValueOnce([])

    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/targets'))
    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: unknown[] }
    expect(body.data).toEqual([])
  })
})

// ── PUT /targets ──────────────────────────────────────────────────────────────

describe('PUT /api/v1/nutrition/targets', () => {
  beforeEach(() => mockSaveAllTargets.mockReset())

  it('returns 200 with saved targets', async () => {
    const targets = makeTargets()
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/targets', json(targets)),
    )
    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: unknown[] }
    expect(body.data).toEqual(targets)
    expect(mockSaveAllTargets).toHaveBeenCalledWith(targets)
  })

  it('returns 400 when fewer than 7 days', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/targets', json(makeTargets().slice(0, 3))),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when duplicate day_of_week', async () => {
    const targets = makeTargets()
    targets[6]!.day_of_week = 0
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/targets', json(targets)),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when calories_min > calories_max', async () => {
    const targets = makeTargets([{ cal_min: 3000, cal_max: 2000 }])
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/targets', json(targets)),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when negative values', async () => {
    const targets = makeTargets([{ cal_min: -100 }])
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/targets', json(targets)),
    )
    expect(res.status).toBe(400)
  })
})

// ── GET /logs/:date ───────────────────────────────────────────────────────────

describe('GET /api/v1/nutrition/logs/:date', () => {
  beforeEach(() => mockGetLogForDate.mockReset())

  it('returns 200 with log data', async () => {
    const log = { id: 'abc', date: '2026-06-23', calories: 2100, protein: 160, carbs: 200, fat: 70, logged_at: '2026-06-23T12:00:00Z' }
    mockGetLogForDate.mockResolvedValueOnce(log)

    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/logs/2026-06-23'))
    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: typeof log }
    expect(body.data).toEqual(log)
    expect(mockGetLogForDate).toHaveBeenCalledWith('test-user-id', '2026-06-23')
  })

  it('returns 200 with null when no log exists', async () => {
    mockGetLogForDate.mockResolvedValueOnce(null)

    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/logs/2026-06-23'))
    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: null }
    expect(body.data).toBeNull()
  })

  it('returns 400 for invalid date format', async () => {
    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/logs/not-a-date'))
    expect(res.status).toBe(400)
  })

  it('returns 400 for partial date', async () => {
    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/logs/2026-06'))
    expect(res.status).toBe(400)
  })
})

// ── PUT /logs/:date ───────────────────────────────────────────────────────────

describe('PUT /api/v1/nutrition/logs/:date', () => {
  beforeEach(() => mockSaveLog.mockReset())

  it('returns 200 with saved log', async () => {
    const values = { calories: 2100, protein: 160, carbs: 200, fat: 70 }
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/logs/2026-06-23', json(values)),
    )
    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: { date: string; calories: number } }
    expect(body.data.date).toBe('2026-06-23')
    expect(body.data.calories).toBe(2100)
    expect(mockSaveLog).toHaveBeenCalledWith('test-user-id', '2026-06-23', values)
  })

  it('accepts null macro values', async () => {
    const values = { calories: null, protein: null, carbs: null, fat: null }
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/logs/2026-06-23', json(values)),
    )
    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: { date: string; calories: null } }
    expect(body.data.calories).toBeNull()
  })

  it('returns 400 for invalid date', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/logs/bad', json({ calories: 1, protein: 1, carbs: 1, fat: 1 })),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 for missing fields', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/logs/2026-06-23', json({ calories: 2100 })),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 for negative values', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/logs/2026-06-23', json({ calories: -1, protein: 0, carbs: 0, fat: 0 })),
    )
    expect(res.status).toBe(400)
  })
})

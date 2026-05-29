import { describe, expect, it, mock, beforeEach } from 'bun:test'
import type { DayTargets, MacroLog } from '../schemas/nutrition.js'

// Fixtures
const TARGET_FIXTURE: DayTargets[] = [
  { day_of_week: 0, calories_min: 2100, calories_max: 2200, protein_min: 160, protein_max: 170, carbs_min: 190, carbs_max: 210, fat_min: 65, fat_max: 75 },
  { day_of_week: 1, calories_min: 2300, calories_max: 2400, protein_min: 165, protein_max: 175, carbs_min: 220, carbs_max: 240, fat_min: 65, fat_max: 75 },
  { day_of_week: 2, calories_min: 2200, calories_max: 2300, protein_min: 160, protein_max: 170, carbs_min: 200, carbs_max: 220, fat_min: 65, fat_max: 75 },
  { day_of_week: 3, calories_min: 2300, calories_max: 2400, protein_min: 165, protein_max: 175, carbs_min: 220, carbs_max: 240, fat_min: 65, fat_max: 75 },
  { day_of_week: 4, calories_min: 2100, calories_max: 2200, protein_min: 160, protein_max: 170, carbs_min: 190, carbs_max: 210, fat_min: 65, fat_max: 75 },
  { day_of_week: 5, calories_min: 2400, calories_max: 2500, protein_min: 165, protein_max: 175, carbs_min: 230, carbs_max: 250, fat_min: 65, fat_max: 75 },
  { day_of_week: 6, calories_min: 2000, calories_max: 2100, protein_min: 155, protein_max: 165, carbs_min: 175, carbs_max: 195, fat_min: 65, fat_max: 75 },
]

const LOG_FIXTURE: MacroLog = {
  id: 'aaaaaaaa-0000-0000-0000-000000000001',
  date: '2026-05-29',
  calories: 2150,
  protein: 165,
  carbs: 200,
  fat: 70,
  logged_at: '2026-05-29T20:00:00.000Z',
}

const mockGetAllTargets = mock(() => Promise.resolve([] as DayTargets[]))
const mockSaveAllTargets = mock(() => Promise.resolve([] as DayTargets[]))
const mockGetLogForDate = mock(() => Promise.resolve(null as MacroLog | null))
const mockSaveLog = mock(() => Promise.resolve(null as unknown as MacroLog))

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

describe('GET /api/v1/nutrition/targets', () => {
  beforeEach(() => { mockGetAllTargets.mockReset() })

  it('returns 200 with targets array', async () => {
    mockGetAllTargets.mockResolvedValueOnce(TARGET_FIXTURE)

    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/targets'))

    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: DayTargets[] }
    expect(body.data).toHaveLength(7)
    expect(body.data[0]?.day_of_week).toBe(0)
  })

  it('returns 200 with empty array when no targets set', async () => {
    mockGetAllTargets.mockResolvedValueOnce([])

    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/targets'))

    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: DayTargets[] }
    expect(body.data).toEqual([])
  })
})

describe('PUT /api/v1/nutrition/targets', () => {
  beforeEach(() => { mockSaveAllTargets.mockReset() })

  it('returns 200 with saved targets', async () => {
    mockSaveAllTargets.mockResolvedValueOnce(TARGET_FIXTURE)

    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/targets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TARGET_FIXTURE),
      }),
    )

    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: DayTargets[] }
    expect(body.data).toHaveLength(7)
  })

  it('returns 400 when fewer than 7 days supplied', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/targets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TARGET_FIXTURE.slice(0, 6)),
      }),
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 for duplicate day_of_week values', async () => {
    const duped = TARGET_FIXTURE.map((t) => ({ ...t, day_of_week: 0 }))

    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/targets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duped),
      }),
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 when calories_min exceeds calories_max', async () => {
    const invalid = TARGET_FIXTURE.map((t, i) =>
      i === 0 ? { ...t, calories_min: 9999, calories_max: 1000 } : t,
    )

    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/targets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalid),
      }),
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 for negative macro values', async () => {
    const invalid = TARGET_FIXTURE.map((t, i) =>
      i === 0 ? { ...t, calories_min: -100 } : t,
    )

    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/targets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalid),
      }),
    )

    expect(res.status).toBe(400)
  })
})

describe('GET /api/v1/nutrition/logs/:date', () => {
  beforeEach(() => { mockGetLogForDate.mockReset() })

  it('returns 200 with log when found', async () => {
    mockGetLogForDate.mockResolvedValueOnce(LOG_FIXTURE)

    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/logs/2026-05-29'))

    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: MacroLog }
    expect(body.data.date).toBe('2026-05-29')
    expect(body.data.calories).toBe(2150)
  })

  it('returns 200 with null when no log exists for date', async () => {
    mockGetLogForDate.mockResolvedValueOnce(null)

    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/logs/2026-05-29'))

    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: null }
    expect(body.data).toBeNull()
  })

  it('returns 400 for invalid date format', async () => {
    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/logs/today'))

    expect(res.status).toBe(400)
  })

  it('returns 400 for date with wrong format (no dashes)', async () => {
    const res = await app.fetch(new Request('http://localhost/api/v1/nutrition/logs/20260529'))

    expect(res.status).toBe(400)
  })
})

describe('PUT /api/v1/nutrition/logs/:date', () => {
  beforeEach(() => { mockSaveLog.mockReset() })

  it('returns 200 with saved log', async () => {
    mockSaveLog.mockResolvedValueOnce(LOG_FIXTURE)

    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/logs/2026-05-29', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calories: 2150, protein: 165, carbs: 200, fat: 70 }),
      }),
    )

    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: MacroLog }
    expect(body.data.calories).toBe(2150)
    expect(body.data.date).toBe('2026-05-29')
  })

  it('accepts null macro values', async () => {
    const nullLog: MacroLog = { ...LOG_FIXTURE, calories: null, protein: null, carbs: null, fat: null }
    mockSaveLog.mockResolvedValueOnce(nullLog)

    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/logs/2026-05-29', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calories: null, protein: null, carbs: null, fat: null }),
      }),
    )

    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: MacroLog }
    expect(body.data.calories).toBeNull()
  })

  it('returns 400 for invalid date format', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/logs/not-a-date', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calories: 2000, protein: 150, carbs: 200, fat: 70 }),
      }),
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 for negative macro value', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/logs/2026-05-29', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calories: -500, protein: 150, carbs: 200, fat: 70 }),
      }),
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 for missing required fields', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/v1/nutrition/logs/2026-05-29', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calories: 2000 }),
      }),
    )

    expect(res.status).toBe(400)
  })
})

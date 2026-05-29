import { describe, expect, it } from 'bun:test'
import { createApp } from '../app'

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

  // Checklist and nutrition are fully implemented — excluded from stub checks
  const domains = ['lists', 'workout', 'bootcamp']

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

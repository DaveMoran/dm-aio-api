import { describe, expect, it } from 'bun:test'
import { createApp } from '../app.js'

const app = createApp()

describe('GET /checklist', () => {
  it('returns 200 with HTML content-type', async () => {
    const res = await app.fetch(new Request('http://localhost/checklist'))

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')
  })

  it('renders morning and evening section headings', async () => {
    const res = await app.fetch(new Request('http://localhost/checklist'))
    const body = await res.text()

    expect(body).toContain('Morning')
    expect(body).toContain('Evening')
  })

  it('page includes the API path for client-side fetch', async () => {
    const res = await app.fetch(new Request('http://localhost/checklist'))
    const body = await res.text()

    expect(body).toContain('/api/v1/checklist')
  })

  it('page includes add-task forms for AM and PM', async () => {
    const res = await app.fetch(new Request('http://localhost/checklist'))
    const body = await res.text()

    expect(body).toContain('am-form')
    expect(body).toContain('pm-form')
  })
})

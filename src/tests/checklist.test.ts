import { describe, expect, it, mock, beforeEach } from 'bun:test'
import type { Task } from '../schemas/checklist.js'

// Fixtures
const amTask: Task = {
  id: '3ea5ec8a-84db-406f-a39d-394b75ca7574',
  name: 'Litter 1',
  period: 'AM',
  sort_order: 1,
  completed: false,
  created_at: '2026-05-25T12:19:57.890539+00:00',
}

const pmTask: Task = {
  id: 'a1536fb3-0e3d-4244-9a73-107dca5a9a79',
  name: 'Prep Stations',
  period: 'PM',
  sort_order: 1,
  completed: false,
  created_at: '2026-05-25T12:19:57.890539+00:00',
}

// Mock must be called before importing the app
const mockGetTasks = mock(() =>
  Promise.resolve({ morning: [] as Task[], evening: [] as Task[] }),
)

const mockCreateTask = mock(() => Promise.resolve(null as Task | null))

const mockUpdateTask = mock(() => Promise.resolve(null as Task | null))

const mockDeleteTask = mock(() => Promise.resolve(false))

mock.module('../services/checklist.js', () => ({
  checklistService: {
    getTasks: mockGetTasks,
    createTask: mockCreateTask,
    updateTask: mockUpdateTask,
    deleteTask: mockDeleteTask,
  },
}))

const { createApp } = await import('../app.js')
const app = createApp()

describe('GET /api/v1/checklist', () => {
  beforeEach(() => {
    mockGetTasks.mockReset()
  })

  it('returns 200 with correct shape when there are no tasks', async () => {
    mockGetTasks.mockImplementation(() =>
      Promise.resolve({ morning: [], evening: [] }),
    )

    const res = await app.fetch(new Request('http://localhost/api/v1/checklist'))

    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: { morning: Task[]; evening: Task[] } }
    expect(body).toEqual({ data: { morning: [], evening: [] } })
  })

  it('groups tasks by period correctly', async () => {
    mockGetTasks.mockImplementation(() =>
      Promise.resolve({ morning: [amTask], evening: [pmTask] }),
    )

    const res = await app.fetch(new Request('http://localhost/api/v1/checklist'))

    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: { morning: Task[]; evening: Task[] } }
    expect(body.data.morning).toHaveLength(1)
    expect(body.data.morning[0]?.id).toBe(amTask.id)
    expect(body.data.evening).toHaveLength(1)
    expect(body.data.evening[0]?.id).toBe(pmTask.id)
  })

  it('returns tasks with all expected fields', async () => {
    mockGetTasks.mockImplementation(() =>
      Promise.resolve({ morning: [amTask], evening: [] }),
    )

    const res = await app.fetch(new Request('http://localhost/api/v1/checklist'))

    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: { morning: Task[]; evening: Task[] } }
    const task = body.data.morning[0]

    expect(task).toBeDefined()
    expect(task?.id).toBe(amTask.id)
    expect(task?.name).toBe(amTask.name)
    expect(task?.period).toBe(amTask.period)
    expect(task?.sort_order).toBe(amTask.sort_order)
    expect(task?.completed).toBe(amTask.completed)
    expect(task?.created_at).toBe(amTask.created_at)
  })
})

describe('POST /api/v1/checklist', () => {
  beforeEach(() => {
    mockCreateTask.mockReset()
  })

  it('returns 201 with created task', async () => {
    const createdTask: Task = {
      id: 'c1234567-0000-0000-0000-000000000001',
      name: 'Test Task',
      period: 'AM',
      sort_order: 7,
      completed: false,
      created_at: '2026-05-26T10:00:00.000000+00:00',
    }
    mockCreateTask.mockResolvedValueOnce(createdTask)

    const res = await app.fetch(
      new Request('http://localhost/api/v1/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Task', period: 'AM', sort_order: 7 }),
      }),
    )

    expect(res.status).toBe(201)

    const body = (await res.json()) as { data: Task }
    expect(body.data).toEqual(createdTask)
  })

  it('returns 400 for missing required field', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/v1/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Bad', sort_order: 1 }),
      }),
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid period value', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/v1/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Bad', period: 'NOON', sort_order: 1 }),
      }),
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 for empty body', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/v1/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }),
    )

    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/v1/checklist/:id', () => {
  const VALID_ID = '3ea5ec8a-84db-406f-a39d-394b75ca7574'

  beforeEach(() => {
    mockUpdateTask.mockReset()
  })

  it('returns 200 with updated task', async () => {
    const updatedTask: Task = {
      id: VALID_ID,
      name: 'Litter 1',
      period: 'AM',
      sort_order: 1,
      completed: true,
      created_at: '2026-05-25T12:19:57.890539+00:00',
    }
    mockUpdateTask.mockResolvedValueOnce(updatedTask)

    const res = await app.fetch(
      new Request(`http://localhost/api/v1/checklist/${VALID_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      }),
    )

    expect(res.status).toBe(200)

    const body = (await res.json()) as { data: Task }
    expect(body.data.completed).toBe(true)
  })

  it('returns 404 when task not found', async () => {
    mockUpdateTask.mockResolvedValueOnce(null)

    const res = await app.fetch(
      new Request(`http://localhost/api/v1/checklist/${VALID_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      }),
    )

    expect(res.status).toBe(404)

    const body = (await res.json()) as { error: string }
    expect(body).toEqual({ error: 'Task not found' })
  })

  it('returns 400 for empty body {}', async () => {
    const res = await app.fetch(
      new Request(`http://localhost/api/v1/checklist/${VALID_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }),
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid period value', async () => {
    const res = await app.fetch(
      new Request(`http://localhost/api/v1/checklist/${VALID_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: 'NOON' }),
      }),
    )

    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/v1/checklist/:id', () => {
  const VALID_ID = '3ea5ec8a-84db-406f-a39d-394b75ca7574'

  beforeEach(() => {
    mockDeleteTask.mockReset()
  })

  it('returns 204 on successful deletion', async () => {
    mockDeleteTask.mockResolvedValueOnce(true)

    const res = await app.fetch(
      new Request(`http://localhost/api/v1/checklist/${VALID_ID}`, {
        method: 'DELETE',
      }),
    )

    expect(res.status).toBe(204)
    const text = await res.text()
    expect(text).toBe('')
  })

  it('returns 404 when task not found', async () => {
    mockDeleteTask.mockResolvedValueOnce(false)

    const res = await app.fetch(
      new Request(`http://localhost/api/v1/checklist/${VALID_ID}`, {
        method: 'DELETE',
      }),
    )

    expect(res.status).toBe(404)

    const body = (await res.json()) as { error: string }
    expect(body).toEqual({ error: 'Task not found' })
  })
})

import { Hono } from 'hono'
import { html } from 'hono/html'

export const uiRouter = new Hono()

uiRouter.get('/', (c) => {
  return c.html(html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Daily Routines</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0f1117;
      --surface: #1a1d27;
      --border: #2a2d3a;
      --accent-am: #f59e0b;
      --accent-pm: #6366f1;
      --text: #e2e8f0;
      --muted: #64748b;
      --danger: #ef4444;
      --radius: 10px;
      --transition: 0.15s ease;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 15px;
      min-height: 100vh;
      padding: 24px 16px 64px;
    }

    header {
      text-align: center;
      margin-bottom: 32px;
    }

    header h1 {
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    header p {
      color: var(--muted);
      font-size: 0.85rem;
      margin-top: 4px;
    }

    .panels {
      display: grid;
      gap: 24px;
      max-width: 720px;
      margin: 0 auto;
    }

    @media (min-width: 640px) {
      .panels { grid-template-columns: 1fr 1fr; }
    }

    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .panel-header h2 {
      font-size: 1rem;
      font-weight: 600;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      border-radius: 99px;
      font-size: 0.7rem;
      font-weight: 700;
      margin-left: auto;
    }

    .badge-am { background: #78350f; color: var(--accent-am); }
    .badge-pm { background: #312e81; color: #a5b4fc; }

    .dot-am { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-am); flex-shrink: 0; }
    .dot-pm { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-pm); flex-shrink: 0; }

    .task-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-height: 24px;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--bg);
      transition: border-color var(--transition), background var(--transition);
      cursor: default;
    }

    .task-item:hover { border-color: #3a3d4a; }

    .task-item.completed { opacity: 0.5; }
    .task-item.completed .task-name { text-decoration: line-through; }

    .task-toggle {
      width: 18px;
      height: 18px;
      border-radius: 5px;
      border: 2px solid var(--muted);
      background: transparent;
      cursor: pointer;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color var(--transition), background var(--transition);
      padding: 0;
    }

    .task-toggle:hover { border-color: var(--text); }

    .task-item.completed .task-toggle {
      border-color: #22c55e;
      background: #22c55e;
    }

    .task-toggle svg { display: none; }
    .task-item.completed .task-toggle svg { display: block; }

    .task-name {
      flex: 1;
      font-size: 0.9rem;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .task-delete {
      background: none;
      border: none;
      color: transparent;
      cursor: pointer;
      padding: 2px;
      border-radius: 4px;
      flex-shrink: 0;
      transition: color var(--transition);
      line-height: 0;
    }

    .task-item:hover .task-delete { color: var(--muted); }
    .task-delete:hover { color: var(--danger) !important; }

    .add-form {
      display: flex;
      gap: 8px;
      margin-top: 14px;
    }

    .add-input {
      flex: 1;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-size: 0.85rem;
      padding: 8px 12px;
      outline: none;
      transition: border-color var(--transition);
    }

    .add-input::placeholder { color: var(--muted); }
    .add-input:focus { border-color: var(--muted); }

    .add-btn {
      flex-shrink: 0;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 8px 14px;
      transition: opacity var(--transition);
    }

    .add-btn:hover { opacity: 0.85; }
    .add-btn:disabled { opacity: 0.4; cursor: default; }
    .add-btn-am { background: var(--accent-am); color: #0f1117; }
    .add-btn-pm { background: var(--accent-pm); color: #fff; }

    .empty-msg {
      color: var(--muted);
      font-size: 0.8rem;
      text-align: center;
      padding: 12px 0;
    }

    .toast-container {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      pointer-events: none;
    }

    .toast {
      background: #1e2030;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-size: 0.82rem;
      padding: 8px 16px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .toast.show { opacity: 1; }
    .toast.error { border-color: var(--danger); color: #fca5a5; }

    .skeleton {
      height: 40px;
      border-radius: 8px;
      background: linear-gradient(90deg, var(--border) 25%, #2f3347 50%, var(--border) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.2s infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  </style>
</head>
<body>
  <header>
    <h1>Daily Routines</h1>
    <p id="date-display"></p>
  </header>

  <div class="panels">
    <!-- Morning -->
    <div class="panel">
      <div class="panel-header">
        <span class="dot-am"></span>
        <h2>Morning</h2>
        <span class="badge badge-am" id="am-badge">0</span>
      </div>
      <ul class="task-list" id="am-list">
        <li class="skeleton"></li>
        <li class="skeleton" style="width:80%"></li>
      </ul>
      <form class="add-form" id="am-form">
        <input
          class="add-input"
          type="text"
          placeholder="Add morning task…"
          id="am-input"
          autocomplete="off"
          maxlength="120"
        />
        <button class="add-btn add-btn-am" type="submit">Add</button>
      </form>
    </div>

    <!-- Evening -->
    <div class="panel">
      <div class="panel-header">
        <span class="dot-pm"></span>
        <h2>Evening</h2>
        <span class="badge badge-pm" id="pm-badge">0</span>
      </div>
      <ul class="task-list" id="pm-list">
        <li class="skeleton"></li>
        <li class="skeleton" style="width:75%"></li>
      </ul>
      <form class="add-form" id="pm-form">
        <input
          class="add-input"
          type="text"
          placeholder="Add evening task…"
          id="pm-input"
          autocomplete="off"
          maxlength="120"
        />
        <button class="add-btn add-btn-pm" type="submit">Add</button>
      </form>
    </div>
  </div>

  <div class="toast-container" id="toast-container"></div>

  <script>
    // ── Helpers ──────────────────────────────────────────────────────────────
    const $ = (id) => document.getElementById(id)

    function showToast(msg, isError = false) {
      const container = $('toast-container')
      const el = document.createElement('div')
      el.className = 'toast' + (isError ? ' error' : '')
      el.textContent = msg
      container.appendChild(el)
      requestAnimationFrame(() => el.classList.add('show'))
      setTimeout(() => {
        el.classList.remove('show')
        setTimeout(() => el.remove(), 250)
      }, 2500)
    }

    // ── State ─────────────────────────────────────────────────────────────────
    // tasks: { id, name, period, sort_order, completed, created_at }[]
    let tasks = []

    // ── Date display ─────────────────────────────────────────────────────────
    const now = new Date()
    $('date-display').textContent = now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    })

    // ── Render ────────────────────────────────────────────────────────────────
    function renderList(period) {
      const listId = period === 'AM' ? 'am-list' : 'pm-list'
      const badgeId = period === 'AM' ? 'am-badge' : 'pm-badge'
      const list = $(listId)
      const periodTasks = tasks.filter((t) => t.period === period)

      // Badge: done / total
      const done = periodTasks.filter((t) => t.completed).length
      $(badgeId).textContent = periodTasks.length
        ? done + '/' + periodTasks.length
        : '0'

      list.innerHTML = ''

      if (periodTasks.length === 0) {
        const li = document.createElement('li')
        li.className = 'empty-msg'
        li.textContent = 'No tasks yet — add one below.'
        list.appendChild(li)
        return
      }

      for (const task of periodTasks) {
        const li = document.createElement('li')
        li.className = 'task-item' + (task.completed ? ' completed' : '')
        li.dataset.id = task.id

        // Toggle button
        const toggleBtn = document.createElement('button')
        toggleBtn.className = 'task-toggle'
        toggleBtn.type = 'button'
        toggleBtn.setAttribute('aria-label', task.completed ? 'Mark incomplete' : 'Mark complete')
        toggleBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        toggleBtn.addEventListener('click', () => handleToggle(task))

        // Name
        const nameSpan = document.createElement('span')
        nameSpan.className = 'task-name'
        nameSpan.title = task.name
        nameSpan.textContent = task.name

        // Delete button
        const delBtn = document.createElement('button')
        delBtn.className = 'task-delete'
        delBtn.type = 'button'
        delBtn.setAttribute('aria-label', 'Delete task')
        delBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
        delBtn.addEventListener('click', () => handleDelete(task))

        li.appendChild(toggleBtn)
        li.appendChild(nameSpan)
        li.appendChild(delBtn)
        list.appendChild(li)
      }
    }

    function render() {
      renderList('AM')
      renderList('PM')
    }

    // ── API ───────────────────────────────────────────────────────────────────
    const API = '/api/v1/checklist'

    async function fetchTasks() {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to load tasks')
      const json = await res.json()
      // Server returns { data: { morning: Task[], evening: Task[] } }
      tasks = [...json.data.morning, ...json.data.evening]
    }

    async function handleToggle(task) {
      // Optimistic update
      task.completed = !task.completed
      render()

      try {
        const res = await fetch(API + '/' + task.id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: task.completed }),
        })
        if (!res.ok) throw new Error('Update failed')
        const json = await res.json()
        // Sync server state
        const idx = tasks.findIndex((t) => t.id === task.id)
        if (idx !== -1) tasks[idx] = json.data
        render()
      } catch (err) {
        // Roll back
        task.completed = !task.completed
        render()
        showToast('Could not update task.', true)
      }
    }

    async function handleDelete(task) {
      // Optimistic update
      tasks = tasks.filter((t) => t.id !== task.id)
      render()

      try {
        const res = await fetch(API + '/' + task.id, { method: 'DELETE' })
        if (!res.ok && res.status !== 404) throw new Error('Delete failed')
      } catch (err) {
        // Roll back
        tasks = [...tasks, task].sort((a, b) => a.sort_order - b.sort_order)
        render()
        showToast('Could not delete task.', true)
      }
    }

    async function handleAdd(period, name) {
      const trimmed = name.trim()
      if (!trimmed) return

      // Next sort_order = max existing + 1 (within the same period)
      const periodTasks = tasks.filter((t) => t.period === period)
      const sortOrder = periodTasks.length
        ? Math.max(...periodTasks.map((t) => t.sort_order)) + 1
        : 1

      // Disable the relevant form while saving
      const formId = period === 'AM' ? 'am-form' : 'pm-form'
      const inputId = period === 'AM' ? 'am-input' : 'pm-input'
      const form = $(formId)
      const btn = form.querySelector('button')
      btn.disabled = true

      try {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmed, period, sort_order: sortOrder }),
        })
        if (!res.ok) throw new Error('Create failed')
        const json = await res.json()
        tasks.push(json.data)
        tasks.sort((a, b) => a.period.localeCompare(b.period) || a.sort_order - b.sort_order)
        $(inputId).value = ''
        render()
      } catch (err) {
        showToast('Could not add task.', true)
      } finally {
        btn.disabled = false
      }
    }

    // ── Form wiring ───────────────────────────────────────────────────────────
    $('am-form').addEventListener('submit', (e) => {
      e.preventDefault()
      handleAdd('AM', $('am-input').value)
    })

    $('pm-form').addEventListener('submit', (e) => {
      e.preventDefault()
      handleAdd('PM', $('pm-input').value)
    })

    // ── Initial load ──────────────────────────────────────────────────────────
    fetchTasks()
      .then(render)
      .catch((err) => {
        console.error(err)
        $('am-list').innerHTML = '<li class="empty-msg">Failed to load — check the server.</li>'
        $('pm-list').innerHTML = '<li class="empty-msg">Failed to load — check the server.</li>'
      })
  </script>
</body>
</html>`)
})

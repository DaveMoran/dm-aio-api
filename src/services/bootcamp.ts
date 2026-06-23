import { getSupabase } from '../lib/supabase.js'
import type { UpsertCurriculum, CurriculumBody } from '../schemas/bootcamp.js'

interface WeekListItem {
  week_number: number
  title: string
  focus: string
  total_hours: number
  dates: string
  start_date: string
  end_date: string
  deliverable: string
}

interface WeekFull extends WeekListItem {
  curriculum: CurriculumBody
}

interface CompletionRow {
  id: string
  item_key: string
  completed_at: string
}

interface ContentRow {
  item_key: string
  content: string
  updated_at: string
}

export const bootcampService = {
  async listWeeks(): Promise<WeekListItem[]> {
    const { data, error } = await getSupabase()
      .from('bootcamp_curriculum')
      .select('week_number, title, focus, total_hours, dates, start_date, end_date, deliverable')
      .order('week_number', { ascending: true })

    if (error) throw new Error(error.message)
    return data ?? []
  },

  async getWeek(weekNumber: number): Promise<WeekFull | null> {
    const { data, error } = await getSupabase()
      .from('bootcamp_curriculum')
      .select('week_number, title, focus, total_hours, dates, start_date, end_date, deliverable, curriculum')
      .eq('week_number', weekNumber)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(error.message)
    }
    return data as WeekFull
  },

  async upsertWeek(weekNumber: number, payload: UpsertCurriculum): Promise<WeekFull> {
    const { data, error } = await getSupabase()
      .from('bootcamp_curriculum')
      .upsert(
        {
          week_number: weekNumber,
          title: payload.title,
          focus: payload.focus,
          total_hours: payload.totalHours,
          dates: payload.dates,
          start_date: payload.startDate,
          end_date: payload.endDate,
          deliverable: payload.deliverable,
          curriculum: payload.curriculum,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'week_number' },
      )
      .select('week_number, title, focus, total_hours, dates, start_date, end_date, deliverable, curriculum')
      .single()

    if (error) throw new Error(error.message)
    return data as WeekFull
  },

  async getCompletions(userId: string): Promise<CompletionRow[]> {
    const { data, error } = await getSupabase()
      .from('bootcamp_completions')
      .select('id, item_key, completed_at')
      .eq('user_id', userId)

    if (error) throw new Error(error.message)
    return data ?? []
  },

  async toggleCompletion(userId: string, itemKey: string, complete: boolean): Promise<void> {
    if (complete) {
      const { error } = await getSupabase()
        .from('bootcamp_completions')
        .upsert(
          { item_key: itemKey, user_id: userId },
          { onConflict: 'item_key,user_id' },
        )
      if (error) throw new Error(error.message)
    } else {
      const { error } = await getSupabase()
        .from('bootcamp_completions')
        .delete()
        .eq('item_key', itemKey)
        .eq('user_id', userId)
      if (error) throw new Error(error.message)
    }
  },

  async getContent(userId: string): Promise<ContentRow[]> {
    const { data, error } = await getSupabase()
      .from('bootcamp_content')
      .select('item_key, content, updated_at')
      .eq('user_id', userId)

    if (error) throw new Error(error.message)
    return data ?? []
  },

  async saveContent(userId: string, itemKey: string, content: string): Promise<void> {
    const { error: contentError } = await getSupabase()
      .from('bootcamp_content')
      .upsert(
        { item_key: itemKey, user_id: userId, content, updated_at: new Date().toISOString() },
        { onConflict: 'item_key,user_id' },
      )
    if (contentError) throw new Error(contentError.message)

    const { error: compError } = await getSupabase()
      .from('bootcamp_completions')
      .upsert(
        { item_key: itemKey, user_id: userId },
        { onConflict: 'item_key,user_id' },
      )
    if (compError) throw new Error(compError.message)
  },

  async generateReport(userId: string, weekNumber: number): Promise<string | null> {
    const week = await this.getWeek(weekNumber)
    if (!week) return null

    const prefix = `w${weekNumber}_`
    const { data: completionRows, error: compErr } = await getSupabase()
      .from('bootcamp_completions')
      .select('item_key')
      .eq('user_id', userId)
      .like('item_key', `${prefix}%`)
    if (compErr) throw new Error(compErr.message)

    const { data: contentRows, error: contErr } = await getSupabase()
      .from('bootcamp_content')
      .select('item_key, content')
      .eq('user_id', userId)
      .like('item_key', `${prefix}%`)
    if (contErr) throw new Error(contErr.message)

    const completed = new Set((completionRows ?? []).map((r) => r.item_key))
    const contentMap = new Map((contentRows ?? []).map((r) => [r.item_key, r.content]))

    return renderReport(week, completed, contentMap)
  },
}

function renderReport(
  week: WeekFull,
  completed: Set<string>,
  contentMap: Map<string, string>,
): string {
  const lines: string[] = []
  const { curriculum } = week

  const allItemKeys = collectAllItemKeys(curriculum)
  const completedCount = allItemKeys.filter((k) => completed.has(k)).length

  lines.push(`# Week ${week.week_number} Report: ${week.title}`)
  lines.push(`Generated: ${new Date().toISOString().split('T')[0]}`)
  lines.push(`Focus: ${week.focus}`)
  lines.push(`Progress: ${completedCount}/${allItemKeys.length} items complete (${Math.round((completedCount / allItemKeys.length) * 100)}%)`)
  lines.push('')

  const acCompleted = curriculum.acceptanceCriteria.filter((i) => completed.has(i.id)).length
  lines.push(`## Week Acceptance Criteria (${acCompleted}/${curriculum.acceptanceCriteria.length} complete)`)
  for (const item of curriculum.acceptanceCriteria) {
    lines.push(renderItem(item.id, item.text, item.type, completed, contentMap))
  }
  lines.push('')

  for (const day of curriculum.days) {
    lines.push(`## ${day.name} (${day.fullDate}) — ${day.hours} hours`)
    if (day.learningFocus) lines.push(`Focus: ${day.learningFocus}`)
    if (day.eveningNote) lines.push(`Note: ${day.eveningNote}`)
    lines.push('')

    for (const block of day.blocks) {
      lines.push(`### ${block.name} (${block.timeRange})`)
      for (const task of block.tasks) {
        lines.push(renderItem(task.id, task.text, task.type, completed, contentMap))
      }
      lines.push('')
    }

    if (day.homework) {
      const hwLabel = day.homework.optional ? 'Homework (Optional)' : 'Homework'
      lines.push(`### ${hwLabel}`)
      if (day.homework.note) lines.push(`Note: ${day.homework.note}`)
      for (let i = 0; i < day.homework.questions.length; i++) {
        const q = day.homework.questions[i]
        const check = completed.has(q.id) ? 'x' : ' '
        lines.push(`${i + 1}. [${check}] ${q.text}`)
        const content = contentMap.get(q.id)
        if (content) lines.push(`   Answer: ${content}`)
      }
      lines.push('')
    }

    if (day.exercises) {
      for (const ex of day.exercises) {
        lines.push(`### Exercise ${ex.number}: ${ex.title} (${ex.timeEstimate}, ${ex.difficulty})`)
        for (const ac of ex.acceptanceCriteria) {
          lines.push(renderItem(ac.id, ac.text, ac.type, completed, contentMap))
        }
        lines.push('')
      }
    }
  }

  return lines.join('\n')
}

function renderItem(
  id: string,
  text: string,
  type: string,
  completed: Set<string>,
  contentMap: Map<string, string>,
): string {
  const check = completed.has(id) ? 'x' : ' '
  let line = `- [${check}] ${text}`
  const content = contentMap.get(id)
  if (content) {
    if (type === 'code') {
      line += `\n      PR: ${content}`
    } else {
      line += `\n      Content: ${content}`
    }
  }
  return line
}

function collectAllItemKeys(curriculum: CurriculumBody): string[] {
  const keys: string[] = []
  for (const ac of curriculum.acceptanceCriteria) keys.push(ac.id)
  for (const day of curriculum.days) {
    for (const block of day.blocks) {
      for (const task of block.tasks) keys.push(task.id)
    }
    if (day.homework) {
      for (const q of day.homework.questions) keys.push(q.id)
    }
    if (day.exercises) {
      for (const ex of day.exercises) {
        for (const ac of ex.acceptanceCriteria) keys.push(ac.id)
      }
    }
  }
  return keys
}

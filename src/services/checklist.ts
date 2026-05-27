// Phase 1 stub — no DB calls yet.
// Phase 2: inject Supabase/Drizzle client here.

export const checklistService = {
  getTasks: async () => {
    return []
  },

  getCompletionsForDate: async (_date: string) => {
    return []
  },

  toggleCompletion: async (_taskId: string, _date: string, _complete: boolean) => {
    return null
  },
}

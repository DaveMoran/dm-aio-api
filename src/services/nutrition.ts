// Phase 1 stub — no DB calls yet.
// Phase 2: inject Supabase/Drizzle client here.

export const nutritionService = {
  getAllTargets: async () => {
    return []
  },

  getLogForDate: async (_date: string) => {
    return null
  },

  saveLog: async (_date: string, _macros: Record<string, number | null>) => {
    return null
  },

  saveAllTargets: async (_targets: unknown[]) => {
    return null
  },
}

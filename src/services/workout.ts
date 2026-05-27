// Phase 1 stub — no DB calls yet.
// Phase 2: inject Supabase/Drizzle client here.

export const workoutService = {
  getScheduleForDay: async (_week: number, _dayOfWeek: number) => {
    return []
  },

  getCompletionsForDate: async (_date: string) => {
    return []
  },

  toggleItemCompletion: async (_scheduleItemId: string, _date: string, _complete: boolean) => {
    return null
  },

  getExercisesForItem: async (_scheduleItemId: string) => {
    return []
  },

  getExerciseCompletionsForDate: async (_date: string) => {
    return []
  },

  toggleExerciseCompletion: async (_exerciseId: string, _date: string, _complete: boolean) => {
    return null
  },
}

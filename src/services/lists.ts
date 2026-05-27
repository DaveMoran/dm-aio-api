// Phase 1 stub — no DB calls yet.
// Phase 2: inject Supabase/Drizzle client here.

export const listsService = {
  getShoppingItems: async () => {
    return []
  },

  getTodoItems: async () => {
    return []
  },

  addShoppingItem: async (_name: string, _category: string) => {
    return null
  },

  addTodoItem: async (_name: string, _priority: string | null, _dueDate: string | null) => {
    return null
  },

  updateShoppingItem: async (_id: string, _updates: Record<string, unknown>) => {
    return null
  },

  updateTodoItem: async (_id: string, _updates: Record<string, unknown>) => {
    return null
  },

  deleteShoppingItem: async (_id: string) => {
    return null
  },

  deleteTodoItem: async (_id: string) => {
    return null
  },
}

import { createMiddleware } from 'hono/factory'
import { supabase } from '../lib/supabase.js'

export const authMiddleware = createMiddleware<{ Variables: { userId: string } }>(
  async (c, next) => {
    const header = c.req.header('Authorization')
    if (!header?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const { data: { user }, error } = await supabase.auth.getUser(header.slice(7))
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    c.set('userId', user.id)
    await next()
  },
)

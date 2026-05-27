import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: Bun.env.CORS_ORIGIN ?? '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})

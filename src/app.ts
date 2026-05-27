import { Hono } from 'hono'
import { corsMiddleware } from './middleware/cors'
import { errorHandler } from './middleware/errorHandler'
import { loggerMiddleware } from './middleware/logger'
import { bootcampRouter } from './routes/bootcamp'
import { checklistRouter } from './routes/checklist'
import { listsRouter } from './routes/lists'
import { nutritionRouter } from './routes/nutrition'
import { workoutRouter } from './routes/workout'

export function createApp() {
  const app = new Hono()

  // Global middleware
  app.use('*', loggerMiddleware)
  app.use('*', corsMiddleware)
  app.onError(errorHandler)

  // Health check
  app.get('/health', (c) =>
    c.json({ status: 'ok', timestamp: new Date().toISOString() }),
  )

  // Domain routers
  app.route('/api/v1/checklist', checklistRouter)
  app.route('/api/v1/lists', listsRouter)
  app.route('/api/v1/workout', workoutRouter)
  app.route('/api/v1/nutrition', nutritionRouter)
  app.route('/api/v1/bootcamp', bootcampRouter)

  return app
}

/**
 * The starting point of the application.
 *
 * @author Julia Lind
 * @version 1.0.0
 */
import { createApp } from './config/create-app.js'
import { startApp } from './config/start-app.js'
import { router } from './routes/router.js'

// exported for testing purposes
export const app = createApp(router)
export const server = startApp(app)

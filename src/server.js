/**
 * The starting point of the application.
 *
 * @author Julia Lind
 * @version 1.0.0
 */
import { createApp } from './config/create-app.js'
import { startApp } from './config/start-app.js'
import { router } from './routes/router.js'


export const app = createApp(router) // exported for testing purposes
startApp(app)

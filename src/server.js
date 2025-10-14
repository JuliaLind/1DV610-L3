/**
 * The starting point of the application.
 *
 * @author Julia Lind
 * @version 1.0.0
 */
import { createApp } from './config/create-app.js'
import { startApp } from './config/start-app.js'

// exported for testing purposes
export const app = createApp()
export const server = startApp(app)

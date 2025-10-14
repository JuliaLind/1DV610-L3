/**
 * The starting point of the application.
 *
 * @author Julia Lind
 * @version 1.0.0
 */
import { createApp } from './config/create-app.js'
import { startApp } from './config/start-app.js'

// to be exported for testing purposes
let app, server

/**
 *
 * @param err
 */
const handleError = (err) => {
  console.error(err)
  process.exitCode = 1
}

try {
  app = createApp()
  server = startApp(app)
} catch (err) {
  handleError(err)
}

export { app, server }

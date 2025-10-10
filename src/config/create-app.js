/**
 * Creates an express app with all necessary
 * configurations.
 *
 * @author Julia Lind
 * @version 1.0.0
 */
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'
import { router } from '../routes/router.js'
import { ErrorHandler } from './ErrorHandler.js'

/**
 * Creates a new app instance with all the
 * configurations.
 *
 * @returns {object} The app instance.
 */
export function createApp() {
  const app = express()
  const errorHandler = new ErrorHandler()

  app.set('trust proxy', true)

  app.use(helmet())  // use helmet for security
  app.use(express.json())
  app.use(cors())   // Enable Cross Origin Resource Sharing (CORS) (https://www.npmjs.com/package/cors).
  app.use(logger('dev'))

  app.use('/', router)

  app.use(errorHandler.handleError)

  return app
}
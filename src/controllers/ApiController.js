/**
 * The starting point of the application.
 *
 * @author Julia Lind
 * @version 1.0.0
 */

import { createApp } from './config/create-app.js'
// to be exported for testing purposes
const app = createApp()
const server = app.listen(process.env.PORT, '0.0.0.0', () => {
    const address = server.address()
    const host = address.address === '::' ? 'localhost' : address.address
    const port = address.port

    console.info(`Server running at http://${host}:${port}`)
    console.info(`Docs available at http://${host}:${port}/v1/docs`)
    console.info('Press Ctrl-C to terminate...')
  })


export { app, connection, server }
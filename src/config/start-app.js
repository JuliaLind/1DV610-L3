/**
 * Starts the application server.
 *
 * @param {Object} app - The Express application.
 * @returns {Object} The server instance.
 */
export function startApp(app) {
  const port = process.env.PORT || 3000
  const server = app.listen(port, '0.0.0.0', () => {
    const address = server.address()
    const host = address.address === '::' ? 'localhost' : address.address
    const port = address.port

    console.info(`Server running at http://${host}:${port}`)
    console.info('Press Ctrl-C to terminate...')
  })

  return server
}
export function startApp (app) {
 const server = app.listen(process.env.PORT, '0.0.0.0', () => {
    const address = server.address()
    const host = address.address === '::' ? 'localhost' : address.address
    const port = address.port

    console.info(`Server running at http://${host}:${port}`)
    console.info('Press Ctrl-C to terminate...')
  })

  return server
}
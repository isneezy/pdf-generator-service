// start the server
import pkg from '../package.json'
import { app, container } from './app'
import { Consola } from 'consola'
import { Browser } from 'puppeteer'

const port = process.env.APP_PORT || 3000
const logger = container.resolve<Consola>('logger')

function handleTearDown() {
  app.set('gracefullyExiting', true)
  logger.info(
    'Attempting gracefully shutdown of the server, waiting for remaining connections to complete.'
  )

  server.close(async () => {
    logger.info('No more connections, shutting down.')
    const browser = container.resolve<Browser>('browser')
    await browser.close()
    process.exit()
  })

  setTimeout(() => {
    logger.error(
      'Could not close connections in time, forcefully shutting down.'
    )
    process.exit(1)
  }, 30 * 100) // 30s
}

process.on('SIGINT', handleTearDown)
process.on('SIGTERM', handleTearDown)

const server = app.listen(port, () => {
  logger.success(
    `${pkg.name} v${pkg.version} is running at http://localhost:${port}`
  )
})

export default server

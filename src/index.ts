import express from 'express'
import bodyParser from "body-parser"
import createRoutes from "./routes";
import {Container} from "./services/Container";
import {Consola} from "consola";
import pkg from '../package.json'
import {Browser} from "puppeteer";

const app = express();
const port = process.env.APP_PORT || 3000
let gracefullyExiting = false

const container = Container.factory(app);
const logger = container.resolve<Consola>('logger')

function handleTearDown() {
  gracefullyExiting = true
  logger.info('Attempting gracefully shutdown of the server, waiting for remaining connections to complete.')

  server.close( async () => {
    logger.info('No more connections, shutting down.')
    const browser = container.resolve<Browser>('browser')
    await browser.close()
    process.exit()
  })

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down.')
    process.exit(1)
  }, 30 * 100) // 30s
}

process.on('SIGINT', handleTearDown)
process.on('SIGTERM', handleTearDown)

// Configure express application
app.set('container', container)
app.use(bodyParser.json())
app.use(createRoutes(container))
app.use((req, res, next) => {
  if (!gracefullyExiting) return next()
  res.setHeader('Connection', 'close')
  res.sendStatus(502).send('Server is in the process of shutdown.')
})

// start the server
const server = app.listen(port, () => {
  logger.success(`${pkg.name} v${pkg.version} is running at http://localhost:${port}`)
});

export { app, server }

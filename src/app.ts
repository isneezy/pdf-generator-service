import express, { Application } from 'express'
import bodyParser from 'body-parser'
import createRoutes from './routes'
import { Container } from './services/Container'

export type CreateAppReturnType = {
  app: Application
  container: Container
}

export default async function createApp(): Promise<CreateAppReturnType> {
  const app = express()
  const container = await Container.factory(app)

  // Configure express application
  app.set('container', container)
  app.set('gracefullyExiting', false)
  app.use(bodyParser.json({ limit: '100mb' }))
  app.use(createRoutes(container))

  app.use((req, res, next) => {
    if (!app.get('gracefullyExiting')) return next()
    res.setHeader('Connection', 'close')
    res.sendStatus(502).send('Server is in the process of shutdown.')
  })

  return { app, container }
}

import express from 'express'
import bodyParser from 'body-parser'
import createRoutes from './routes'
import { Container } from './services/Container'

const app = express()
const container = Container.factory(app)

// Configure express application
app.set('container', container)
app.set('gracefullyExiting', false)
app.use(bodyParser.json())
app.use(createRoutes(container))

app.use((req, res, next) => {
  if (!app.get('gracefullyExiting')) return next()
  res.setHeader('Connection', 'close')
  res.sendStatus(502).send('Server is in the process of shutdown.')
})

export { app, container }

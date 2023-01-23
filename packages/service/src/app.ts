import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import pick from 'lodash.pick'
import pkg from '../package.json'
import { ValidationError } from 'yup'
import { GRACEFULLY_EXITING } from './constants'
import PdfGenerator, { Options } from '@isneezy/pdf-generator'
import { PDFOptionsSchema } from './helpers/validation'

export const createApp = async () => {
  const app = express()
  const instance = await PdfGenerator.instance()

  app.on(GRACEFULLY_EXITING, async () => {
    console.debug('Releasing resources...')
    await instance.close()
  })

  app.set(GRACEFULLY_EXITING, false)
  const limit = process.env.REQUEST_BODY_LIMIT || '100mb'

  app.use(helmet())
  app.use(bodyParser.json({ limit }))

  app.get('/', (req, res) => {
    res.json(pick(pkg, 'name', 'description', 'version', 'homepage', 'author', 'repository', 'bugs'))
  })

  app.post('/v1/generate', async (req, res) => {
    try {
      // noinspection ES6RedundantAwait
      const options = (await PDFOptionsSchema.validate(req.body)) as Options
      const pdfBuffer = instance.generate(options)
      res.status(200).setHeader('Content-Type', 'application/pdf')
      res.send(pdfBuffer).end()
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(422).json({
          message: 'Your request could not be processed',
          errors: e.errors,
        })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  })

  app.get('/v1/generate', async (req, res) => {
    try {
      // noinspection ES6RedundantAwait
      const options = (await PDFOptionsSchema.validate(req.query)) as Options
      const pdfBuffer = await instance.generate(options)
      res.setHeader('Content-Type', 'application/pdf')
      res.send(pdfBuffer).end()
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(422).json({
          message: 'Your request could not be processed',
          errors: e.errors,
        })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  })

  return app
}

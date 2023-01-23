import express, { Response } from 'express'
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
    await handleGenerateRequest(instance, req.body, res)
  })

  app.get('/v1/generate', async (req, res) => {
    await handleGenerateRequest(instance, req.query, res)
  })

  return app
}

const handleGenerateRequest = async (instance: PdfGenerator, options: Options, response: Response) => {
  try {
    // noinspection ES6RedundantAwait,TypeScriptValidateJSTypes
    options = (await PDFOptionsSchema.validate(options)) as Options
    const pdfBuffer = await instance.generate(options)
    response.setHeader('Content-Type', 'application/pdf')
    response.send(pdfBuffer).end()
  } catch (e) {
    if (e instanceof ValidationError) {
      response.status(422).json({
        message: 'Your request could not be processed',
        errors: e.errors,
      })
    } else {
      response.status(500).json({ message: 'Internal server error' })
    }
  }
}

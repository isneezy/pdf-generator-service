import { Router } from 'express'
import pick from 'lodash.pick'
import pkg from '../package.json'
import { pdfOptionsFactory } from './services/PdfOptions'
import { Pdf } from './services/pdf'
import { validatePayload } from './payloadValidator'
import { Container } from './services/Container'
import { Consola } from 'consola'

export default function createRoutes(iocContainer: Container): Router {
  const logger = iocContainer.resolve<Consola>('logger')
  const router = Router()

  router.get('/', (req, res) => {
    res.json(pick(pkg, 'name', 'description', 'version', 'homepage', 'author', 'repository', 'bugs'))
  })

  router.post('/generate', async (req, res) => {
    const errors = validatePayload(req.body)

    if (Object.keys(errors).length) {
      res
        .status(400)
        .json({
          message: 'Unprocessable request',
          errors,
        })
        .end()
      return
    }

    try {
      const pdfService = iocContainer.resolve<Pdf>('pdf')
      const pdf = await pdfService.generate(pdfOptionsFactory(req.body))
      res.setHeader('Content-Type', 'application/pdf')
      res.send(pdf).end()
    } catch (e) {
      logger.error(e.message, e)
      res
        .status(500)
        .json({
          message: 'An error occurred while rendering the PDF document!',
        })
        .end()
    }
  })

  return router
}

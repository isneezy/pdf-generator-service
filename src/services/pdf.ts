import { Browser } from 'puppeteer'
import handlebars from 'handlebars'
import { PdfOptions, pdfOptionsFactory } from './PdfOptions'
import {
  compileHeaderOrFooterTemplate,
  prepareToc,
  extractToc,
  enhanceContent,
  mergePDFs,
} from '../utils'

export const PAPER_FORMATS = ['A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid']
export const PAGE_ORIENTATIONS = ['portrait', 'landscape']

export class Pdf {
  private browser: Browser

  constructor(browser: Browser) {
    this.browser = browser
  }

  public async generate(options: PdfOptions): Promise<Buffer> {
    options = pdfOptionsFactory(options)
    const page = await this.browser.newPage()
    await enhanceContent(options)
    prepareToc(options)
    try {
      if (options.context) {
        options.content = handlebars.compile(options.content)({
          ...options.context,
          ...options.tocContext,
        })
      }
      await page.setContent(options.content, { waitUntil: 'networkidle2' })

      const displayHeaderFooter = !!(options.header || options.footer)
      options.header = compileHeaderOrFooterTemplate(options.header, options)
      options.footer = compileHeaderOrFooterTemplate(options.footer, options)

      const pdfOptions = {
        format: options.format,
        landscape: options.orientation == 'landscape',
        margin: options.margin,
        printBackground: true,
        displayHeaderFooter,
        headerTemplate: options.header,
        footerTemplate: options.footer,
      }

      const renderedPDF = await page.pdf(pdfOptions)

      await extractToc(renderedPDF, options)

      if (options.tocTemplate) {
        const tocTemplate = handlebars.compile(options.tocTemplate)(
          options.tocContext
        )
        await page.setContent(tocTemplate)
        const tocPDF = await page.pdf(pdfOptions)
        const bytes = await mergePDFs(renderedPDF, tocPDF)
        return Buffer.from(bytes)
      }

      return renderedPDF
    } catch (e) {
      throw e
    } finally {
      await page.close()
    }
  }
}

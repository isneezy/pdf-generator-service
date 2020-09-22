import { Browser } from 'puppeteer'
import handlebars from 'handlebars'
import { PdfOptions, pdfOptionsFactory } from './PdfOptions'
import { compileHeaderOrFooterTemplate } from '../utils'

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
    try {
      if (options.context) {
        options.content = handlebars.compile(options.content)(options.context)
      }
      await page.setContent(options.content, { waitUntil: 'networkidle2' })

      const displayHeaderFooter = !!(options.header || options.footer)
      options.header = compileHeaderOrFooterTemplate(options.header, options)
      options.footer = compileHeaderOrFooterTemplate(options.footer, options)

      return await page.pdf({
        format: options.format,
        landscape: options.orientation == 'landscape',
        margin: options.margin,
        printBackground: true,
        displayHeaderFooter,
        headerTemplate: options.header,
        footerTemplate: options.footer,
      })
    } catch (e) {
      throw e
    } finally {
      await page.close()
    }
  }
}

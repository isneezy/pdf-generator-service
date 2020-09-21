import { Browser } from 'puppeteer'
import handlebars from 'handlebars'
import { PdfOptions, pdfOptionsFactory } from './PdfOptions'

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
      return await page.pdf({
        format: options.format,
        landscape: options.orientation == 'landscape',
        margin: options.margin,
        printBackground: true,
        displayHeaderFooter: true,
        footerTemplate:
          '<div><table style="width: 100%; margin-left: 38px; margin-right: 38px; font-size: 8px; text-align: center">' +
          '<tr>' +
          '<td>' +
          '<p>Página <span class="pageNumber"></span> de <span class="totalPages"></span></p>' +
      })
    } catch (e) {
      throw e
    } finally {
      await page.close()
    }
  }
}

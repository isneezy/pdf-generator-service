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

      // Currently the header and footer on chromium does not inherit the document styles.
      // This issue causes them to render with font-size: 0 and causes them to render on the edge of the page
      // has a dirty fix we will force it to be rendered with some sensible defaults and it can be override by setting an inner style.
      options.footer = `<div style="margin: 0 1.2cm; font-size: 8px">${options.footer}</div>`
      options.header = `<div style="margin: 0 1.2cm; font-size: 8px">${options.header}</div>`

      return await page.pdf({
        format: options.format,
        landscape: options.orientation == 'landscape',
        margin: options.margin,
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: options.header,
        footerTemplate: options.footer,
        margin: {
          top: '1.92cm',
          bottom: '1.92cm',
          left: '1.2cm',
          right: '1.2cm',
        },
      })
    } catch (e) {
      throw e
    } finally {
      await page.close()
    }
  }
}

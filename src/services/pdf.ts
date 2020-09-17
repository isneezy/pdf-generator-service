import { Browser } from 'puppeteer'
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
      await page.setContent(options.content, { waitUntil: 'networkidle2' })
      const pdf = await page.pdf({
        format: options.format,
        landscape: options.orientation == 'landscape',
        printBackground: true,
      })
      await page.close()
      return pdf
    } catch (e) {
      if (page) {
        await page.close()
      }
      throw new e()
    }
  }
}

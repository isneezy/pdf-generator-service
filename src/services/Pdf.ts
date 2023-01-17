import { Browser, Page, PDFOptions } from 'puppeteer'
import { PdfOptions, pdfOptionsFactory } from './PdfOptions'
import { enhanceContent } from '../util'
import { extractPDFToc } from '../util/pdf'

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

    try {
      const pdfBuffer = await Pdf.generateContent(options, page)
      return await Pdf.generateToc(pdfBuffer, options, page)
    } catch (e) {
      throw e
    } finally {
      await page.close()
    }
  }

  private static async generateContent(options: PdfOptions, page: Page): Promise<Buffer> {
    if (options.goto) await page.goto(options.goto, { waitUntil: 'networkidle0' })
    else await page.setContent(options.content, { waitUntil: 'networkidle0' })
    const pdfOptions = Pdf.buildPdfArguments(options, false)
    return await page.pdf(pdfOptions)
  }

  private static async generateToc(pdfBuffer: Buffer, options: PdfOptions, page: Page): Promise<Buffer> {
    if (options.tocTemplate) {
      await extractPDFToc(pdfBuffer, options)
      await page.setContent(options.content, { waitUntil: 'networkidle0' })
      const pdfOptions = Pdf.buildPdfArguments(options, false)
      return await page.pdf(pdfOptions)
    }

    return pdfBuffer
  }

  private static buildPdfArguments(options: PdfOptions, toc: boolean): PDFOptions {
    return {
      format: options.format,
      landscape: options.orientation == 'landscape',
      margin: options.margin,
      printBackground: true,
      displayHeaderFooter: toc ? false : options.displayHeaderFooter,
      headerTemplate: options.header,
      footerTemplate: options.footer,
    }
  }
}

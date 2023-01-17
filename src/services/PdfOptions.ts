import defaults from 'lodash.defaults'
import { PDFMargin, PaperFormat } from 'puppeteer'
import {isValidURL} from "../util";

export type PDFOrientation = 'landscape' | 'portrait'
export type TocEntry = {
  id: string
  title: string
  level: number
  href: string
  page?: number
}
export interface PdfOptions {
  goto?: string
  orientation?: PDFOrientation
  format?: PaperFormat
  content: string
  context?: Record<string, unknown>
  header?: string
  footer?: string
  displayHeaderFooter?: boolean
  tocTemplate?: string
  tocContext: {
    _toc: TocEntry[]
  }
  margin?: PDFMargin
}

export function pdfOptionsFactory(options: Partial<PdfOptions>): PdfOptions {
  if (options.goto && !isValidURL(options.goto)) throw new Error('invalid value passed to goto option')
  if ((!options.content || !options.content.length) && !options.goto) {
    throw new Error('content should not be empty')
  }

  // if we follow the puppeteer 9.0.0 types we have to introduce a breaking
  // change where all the page formats are in lower case format
  // to avoid us to introduce this breaking change me need to make the page format lowercase our selves.
  options.format = (options.format || 'A4').toLocaleLowerCase() as PaperFormat

  return defaults<Partial<PdfOptions>, PdfOptions>(options, {
    content: '',
    footer: '',
    header: '',
    orientation: 'portrait',
    tocContext: { _toc: [] },
    margin: defaults(options.margin, {
      top: '1.9cm',
      bottom: '1.9cm',
      left: '1.9cm',
      right: '1.9cm',
    }),
  })
}

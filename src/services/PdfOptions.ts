import defaults from 'lodash.defaults'
import { LayoutDimension, PDFFormat } from 'puppeteer'
export type PDFOrientation = 'landscape' | 'portrait'
export interface PdfOptions {
  orientation?: PDFOrientation
  format?: PDFFormat
  content: string
  context?: Record<string | number, unknown>
  header?: string
  footer?: string
  margin?: {
    top?: LayoutDimension
    bottom?: LayoutDimension
    left?: LayoutDimension
    right?: LayoutDimension
  }
}

export function pdfOptionsFactory(options: PdfOptions): PdfOptions {
  if (!options.content || !options.content.length) {
    throw new Error('content should not be empty')
  }
  return defaults<Partial<PdfOptions>, PdfOptions>(options, {
    content: '',
    footer: '',
    header: '',
    format: 'A4',
    orientation: 'portrait',
    margin: defaults(options.margin, {
      top: '1.9cm',
      bottom: '1.9cm',
      left: '1.9cm',
      right: '1.9cm',
    }),
  })
}

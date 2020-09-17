import defaults from 'lodash.defaults'
import { PDFFormat } from 'puppeteer'
export type PDFOrientation = 'landscape' | 'portrait'
export interface PdfOptions {
  orientation: PDFOrientation
  format: PDFFormat
  content: string
}

export function pdfOptionsFactory(options: Partial<PdfOptions>): PdfOptions {
  if (!options.content || !options.content.length)
    throw new Error('content should not be empty')
  return defaults<Partial<PdfOptions>, PdfOptions>(options, {
    content: '',
    format: 'A4',
    orientation: 'portrait',
  })
}

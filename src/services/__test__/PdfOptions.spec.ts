import { PdfOptions, pdfOptionsFactory } from '../PdfOptions'
import { throws } from 'assert'

describe('PdfOptions', () => {
  it('must trow error with message `content should not be empty` when content is empty', () => {
    throws(
      () => pdfOptionsFactory({ content: '' }),
      /content should not be empty/
    )
  })

  it('pdfOptionsFactory can be called only with content', () => {
    const options = pdfOptionsFactory({ content: '<div>Testing</div>' })
    expect(options.content).toBe('<div>Testing</div>')
    expect(options.orientation).toBe('portrait')
    expect(options.format).toBe('A4')
  })

  it('default parameters can be replaced', () => {
    const params = {
      content: '<h2>Hello</h2>',
      orientation: 'landscape' as PDFOrientation,
      format: 'Letter' as PDFFormat,
    }
    const options = pdfOptionsFactory(params)
    expect(options).toMatchObject(params)
  })
})

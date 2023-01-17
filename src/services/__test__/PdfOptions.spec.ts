import { pdfOptionsFactory, PDFOrientation } from '../PdfOptions'
import { throws } from 'assert'
import { PaperFormat } from 'puppeteer'

describe('PdfOptions', () => {
  it('must not throw any errors when content is not present and got is valid url', () => {
    pdfOptionsFactory({ goto: 'https://www.example.com' })
  })
  it('must throw  errors when goto is not valid URL', () => {
    throws(() => pdfOptionsFactory({ goto: 'www.example.com' }), /invalid value passed to goto option/)
  })
  it('must trow error with message `content should not be empty` when content is empty', () => {
    throws(() => pdfOptionsFactory({ content: '' }), /content should not be empty/)
  })

  it('pdfOptionsFactory can be called only with content', () => {
    const options = pdfOptionsFactory({ content: '<div>Testing</div>' })
    expect(options.content).toBe('<div>Testing</div>')
    expect(options.orientation).toBe('portrait')
    expect(options.format).toBe('a4')
  })

  it('default parameters can be replaced', () => {
    const params = {
      content: '<h2>Hello</h2>',
      orientation: 'landscape' as PDFOrientation,
      format: 'ledger' as PaperFormat,
    }
    const options = pdfOptionsFactory(params)
    expect(options).toMatchObject(params)
  })
})

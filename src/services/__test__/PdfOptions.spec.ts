import { PdfOptions, pdfOptionsFactory } from '../PdfOptions'

describe('PdfOptions', () => {
  it('pdfOptionsFactory can be called only with content', () => {
    const options = pdfOptionsFactory({ content: '<div>Testing</div>' })
    expect(options.content).toBe('<div>Testing</div>')
    expect(options.orientation).toBe('portrait')
    expect(options.format).toBe('A4')
  })

  it('default parameters can be replaced', () => {
    const params: PdfOptions = {
      content: '<h2>Hello</h2>',
      orientation: 'landscape',
      format: 'Letter',
    }
    const options = pdfOptionsFactory(params)
    expect(options).toMatchObject(params)
  })
})

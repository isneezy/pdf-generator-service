import { pdfOptionsFactory } from '../services/PdfOptions'
import { compileHeaderOrFooterTemplate } from '../utils'

describe('utils.ts', () => {
  it('should wrap the template with a div with margin and font size', () => {
    const options = pdfOptionsFactory({ content: '<h1>hello</h1>' })
    const template = '<h2>hello</h2>'
    const expected = `<div style="margin: 0 1.9cm 0 1.9cm; font-size: 8px"><h2>hello</h2></div>`
    expect(compileHeaderOrFooterTemplate(template, options)).toBe(expected)
  })

  it('should make the context available to the template', () => {
    const options = pdfOptionsFactory({
      content: '<h1>hello</h1>',
      context: { name: 'PDF Express' },
    })
    const template = '<h2>hello {{ name }}</h2>'
    const expected = `<div style="margin: 0 1.9cm 0 1.9cm; font-size: 8px"><h2>hello PDF Express</h2></div>`
    expect(compileHeaderOrFooterTemplate(template, options)).toBe(expected)
  })
})

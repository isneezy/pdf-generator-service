import { pdfOptionsFactory } from '../../services/PdfOptions'
import { compileHeaderOrFooterTemplate, enhanceContent, prepareToc } from '..'

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

  it('should compile and inject header and footer template if any of them is present', async () => {
    const content = '<h1>Hello</h1>'
    const template = '{{{ pageNumber }}} {{{totalPages}}} {{{date}}} {{{title}}} {{{url}}}'
    const options = pdfOptionsFactory({ content, header: template, footer: template })
    await enhanceContent(options)

    expect(options.displayHeaderFooter).toBeTruthy()
    expect(options.header).toBe(
      `<div style="margin: 0 1.9cm 0 1.9cm; font-size: 8px"><span class="pageNumber"></span> <span class="pageNumber"></span> <span class="date"></span> <span class="title"></span> <span class="url"></span></div>`
    )
    expect(options.footer).toBe(
      `<div style="margin: 0 1.9cm 0 1.9cm; font-size: 8px"><span class="pageNumber"></span> <span class="pageNumber"></span> <span class="date"></span> <span class="title"></span> <span class="url"></span></div>`
    )
  })
})

describe('prepareToc from src/utils.ts', () => {
  it('should render TOC when element with `.print-toc` class is present', () => {
    const content =
      '<div class="print-toc">{{#each _toc}}<a href="{{this.id}}">{{this.title}}</a>{{/each}}</div><h1 id="test">hello</h1>'
    const options = pdfOptionsFactory({
      content,
      context: { name: 'PDF Express' },
    })

    prepareToc(options)

    expect(options.tocTemplate).toMatch(
      `<html><head></head><body><div class="print-toc" style="page-break-after: always;">{{#each _toc}}<a href="{{this.id}}">{{this.title}}</a>{{/each}}</div></body></html>`
    )
    expect(options.tocContext._toc).toStrictEqual([{ id: 'test', title: 'hello', level: 1, href: `#test` }])
  })

  it('should add ids to heading tag if none are available', function () {
    const content = '<div class="print-toc"></div><h1>hello</h1><h2>hello2</h2>'
    const options = pdfOptionsFactory({ content })
    prepareToc(options)

    expect(options.tocContext._toc).toStrictEqual([
      expect.objectContaining({ id: expect.anything(), level: 1 }),
      expect.objectContaining({ id: expect.anything(), level: 2 }),
    ])
  })

  it('should add .toc-ignore class to all headings inside toc template', () => {
    const content = '<div class="print-toc"><h1></h1><h2></h2><h3></h3><h4></h4><h5></h5><h6></h6></div>'
    const options = pdfOptionsFactory({ content })
    prepareToc(options)
    expect(options.content).toMatch(/<h1 class="toc-ignore"><\/h1>/)
    expect(options.content).toMatch(/<h2 class="toc-ignore"><\/h2>/)
    expect(options.content).toMatch(/<h3 class="toc-ignore"><\/h3>/)
    expect(options.content).toMatch(/<h4 class="toc-ignore"><\/h4>/)
    expect(options.content).toMatch(/<h5 class="toc-ignore"><\/h5>/)
    expect(options.content).toMatch(/<h6 class="toc-ignore"><\/h6>/)
  })

  it('should insert an element with removeAfterTocExtraction and heading id as its contents', function () {
    const content = '<div class="print-toc"></div><h1 id="hel1">hello</h1><h2>hello2</h2>'
    const options = pdfOptionsFactory({ content })
    prepareToc(options)
    options.tocContext._toc.forEach((data) =>
      expect(options.content).toContain(`class="removeAfterTocExtraction">${data.id}<`)
    )
  })
})

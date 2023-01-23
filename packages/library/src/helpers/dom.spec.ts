import { describe, it, expect } from 'vitest'
import { extractHeaderAndFooter, inlineCss, prepareTableOfContents } from './dom'
import { Options } from '../index'

describe('src/helpers/dom.ts', () => {
  it('should return an empty string if no template is passed', async () => {
    const output = await inlineCss('')
    expect(output).toBe('')
  })

  it('should inline css properties from style tag', async () => {
    const template = '<style>div{ color: #fff; }</style><div>Hello</div><p>Hello</p>'
    const output = await inlineCss(template)
    expect(output).toBe('<html><head></head><body><div style="color: #fff;">Hello</div><p>Hello</p></body></html>')
  })

  it('should extract header and footer template from the document', () => {
    const template = `
    <div class="document-header" style="font-size: 5pt">Header in page {{ pageNumber }} of {{ totalPages }}</div>
    <div class="document-footer" style="font-size: 5pt">Footer in page {{ pageNumber }} of {{ totalPages }}</div>
    <p>Just for fun</p>
    `

    const options: Options = { template }

    extractHeaderAndFooter(options)

    expect(options.headerTemplate).toBe(
      '<div class="document-header" style="font-size: 5pt">Header in page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
    )

    expect(options.footerTemplate).toBe(
      '<div class="document-footer" style="font-size: 5pt">Footer in page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
    )
  })

  describe('table of contents', () => {
    it('should render table of contents when element with `#table-of-contents` selector is present', () => {
      // given
      const template =
        '<div id="table-of-contents">{{#each _toc}}<a href="{{this.id}}">{{this.title}}</a>{{/each}}</div><h1 id="test">hello</h1>'
      const context = { name: 'PDF Generator' }
      const options = { template, context }
      // when
      const tableOfContents = prepareTableOfContents(options)
      // then
      expect(tableOfContents.template).toMatch(
        `<html><head></head><body><div id="table-of-contents" style="page-break-after: always;">{{#each _toc}}<a href="{{this.id}}">{{this.title}}</a>{{/each}}</div></body></html>`
      )
      expect(tableOfContents.items).toStrictEqual([{ id: 'test', title: 'hello', level: 1, href: `#test` }])
    })

    it('should add ids to heading tag if none are available', function () {
      // given
      const template = '<div id="table-of-contents"></div><h1>hello</h1><h2>hello2</h2>'
      const options = { template }
      // when
      const tableOfContents = prepareTableOfContents(options)
      // then
      expect(tableOfContents.items).toStrictEqual([
        expect.objectContaining({ id: expect.anything(), level: 1 }),
        expect.objectContaining({ id: expect.anything(), level: 2 }),
      ])
    })

    it('should add `.toc-exclude` class to all headings inside toc template', () => {
      const template = '<div id="table-of-contents"><h1></h1><h2></h2><h3></h3><h4></h4><h5></h5><h6></h6></div>'
      const options = { template }
      prepareTableOfContents(options)
      expect(options.template).toMatch(/<h1 class="toc-exclude"><\/h1>/)
      expect(options.template).toMatch(/<h2 class="toc-exclude"><\/h2>/)
      expect(options.template).toMatch(/<h3 class="toc-exclude"><\/h3>/)
      expect(options.template).toMatch(/<h4 class="toc-exclude"><\/h4>/)
      expect(options.template).toMatch(/<h5 class="toc-exclude"><\/h5>/)
      expect(options.template).toMatch(/<h6 class="toc-exclude"><\/h6>/)
    })

    it('should insert an element with removeAfterTocExtraction and heading id as its contents', function () {
      const template = '<div id="table-of-contents"></div><h1 id="hel1">hello</h1><h2>hello2</h2>'
      const options = { template }
      const tableOfContents = prepareTableOfContents(options)
      tableOfContents.items.forEach((item) =>
        expect(options.template).toContain(`class="removeAfterTocExtraction">${item.id}<`)
      )
    })
  })
})

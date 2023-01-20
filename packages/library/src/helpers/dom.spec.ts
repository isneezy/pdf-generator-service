import { jest, describe, it, expect } from "@jest/globals";
import { extractHeaderAndFooter, inlineCss } from "./dom";
import { Options } from "../index";

describe('src/helpers/dom.ts', () => {
  it('should return an empty string if no template is passed', async () => {
    const output = await inlineCss('')
    expect(output).toBe('')
  })

  it('should inline css properties from style tag', async () => {
    const template = '<style>div{ color: #fff; }</style><div>Hello</div><p>Hello</p>'
    const output = await inlineCss(template)
    expect(output).toBe("<html><head></head><body><div style=\"color: #fff;\">Hello</div><p>Hello</p></body></html>")
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
})
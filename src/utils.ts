import { PdfOptions } from './services/PdfOptions'
import handlebars from 'handlebars'
import { JSDOM } from 'jsdom'
import UID from 'uid-safe'
import { query } from 'express'

type TemplateType = string | undefined
export function compileHeaderOrFooterTemplate(
  template: TemplateType,
  options: PdfOptions
): string {
  // Currently the header and footer on chromium does not inherit the document styles.
  // This issue causes them to render with font-size: 0 and causes them to render on the edge of the page
  // has a dirty fix we will force it to be rendered with some sensible defaults and it can be override by setting an inner style.
  const printTemplate = `<div style="margin: 0 ${options.margin?.right} 0 ${options.margin?.left}; font-size: 8px">${template}</div>`
  if (options.context) {
    const context = {
      ...options.context,
      options,
      date: '<span class="date"></span>',
      title: '<span class="title"></span>',
      url: '<span class="url"></span>',
      pageNumber: '<span class="pageNumber"></span>',
      totalPages: '<span class="pageNumber"></span>',
    }
    return handlebars.compile(printTemplate)(context)
  }
  return printTemplate
}

declare type TocEntry = {
  id: string
  title: string
  level: string
  href: string
}

export const prepareToc = (options: PdfOptions) => {
  const document = new JSDOM(options.content).window.document

  document.querySelectorAll('.print-toc').forEach((el) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // el.style['page-break-before'] = 'always'
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    el.style['page-break-after'] = 'always'
  })

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const tocEntries: TocEntry[] = []

  headings.forEach((h) => {
    const title = h.textContent || ''
    if (title && title.length) {
      const id = h.id || UID.sync(16)
      const level = h.tagName.substr(1)
      h.id = id
      tocEntries.push({ id, title, level, href: `#${id}` })
    }
  })

  options.content = document.documentElement.outerHTML
  options.context = {
    ...options.context,
    _toc: tocEntries,
  }
}

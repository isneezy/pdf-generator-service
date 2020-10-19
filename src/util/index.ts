import { PdfOptions } from '../services/PdfOptions'
import handlebars from 'handlebars'
import { JSDOM } from 'jsdom'
import UID from 'uid-safe'
import inlineCss from 'inline-css'

type TemplateType = string | undefined

export function compileHeaderOrFooterTemplate(template: TemplateType, options: PdfOptions): string {
  // Currently the header and footer on chromium does not inherit the document styles.
  // This issue causes them to render with font-size: 0 and causes them to render on the edge of the page
  // has a dirty fix we will force it to be rendered with some sensible defaults and it can be override by setting an inner style.
  const printTemplate = `<div style="margin: 0 ${options.margin?.right} 0 ${options.margin?.left}; font-size: 8px">${template}</div>`
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

export function prepareToc(options: PdfOptions): void {
  const tocIgnoreClass = 'toc-ignore'
  const headingSelectors = 'h1, h2, h3, h4, h5, h6'
  const document = new JSDOM(options.content).window.document
  const tocElement: HTMLElement | null = document.querySelector('.print-toc')

  if (tocElement) {
    tocElement.style.pageBreakAfter = 'always'
    // Extract TOC template and include the default html head tag
    const tocDocument = new JSDOM(options.content).window.document
    const bodyEl = tocDocument.querySelector('body') as HTMLElement

    // Exclude headings inside toc template from the toc itself
    tocElement.querySelectorAll(headingSelectors).forEach((h) => h.classList.add(tocIgnoreClass))

    bodyEl.innerHTML = tocElement.outerHTML
    options.tocTemplate = tocDocument.documentElement.outerHTML
    options.content = document.documentElement.outerHTML

    document.querySelectorAll(headingSelectors).forEach((h) => {
      if (h.classList.contains(tocIgnoreClass)) return
      const title = h.textContent || ''
      if (title && title.length) {
        const id = h.id || UID.sync(16)
        const level = Number.parseInt(h.tagName.substr(1))
        h.id = id
        options.tocContext._toc.push({ id, title, level, href: `#${id}` })
      }
    })
  }
}

export async function enhanceContent(options: PdfOptions): Promise<void> {
  options.content = await inlineCss(options.content, {
    applyLinkTags: true,
    applyStyleTags: true,
    applyTableAttributes: true,
    applyWidthAttributes: true,
    extraCss: '',
    preserveMediaQueries: true,
    removeHtmlSelectors: true,
    removeLinkTags: true,
    removeStyleTags: true,
    url: ' ',
  })
  prepareToc(options)

  if (options.context) {
    options.content = handlebars.compile(options.content)({
      ...options.context,
      ...options.tocContext,
    })
  }

  options.displayHeaderFooter = !!(options.header || options.footer)
  if (options.displayHeaderFooter) {
    options.header = compileHeaderOrFooterTemplate(options.header, options)
    options.footer = compileHeaderOrFooterTemplate(options.footer, options)
  }
}

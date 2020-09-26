import { PdfOptions, TocEntry } from './services/PdfOptions'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import PdfParser from 'j-pdfjson'
import parsePdf from 'pdf-parse'
import handlebars from 'handlebars'
import { JSDOM } from 'jsdom'
import UID from 'uid-safe'
import inlineCss from 'inline-css'
import { PDFDocument } from 'pdf-lib'

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

export const prepareToc = (options: PdfOptions) => {
  console.log(options.content)
  const document = new JSDOM(options.content).window.document

  const tocElement: HTMLElement | null = document.querySelector('.print-toc')
  console.log(tocElement)
  if (tocElement) {
    tocElement.style.pageBreakAfter = 'always'
    // Extract TOC template and include the default html head tag
    const tocDocument = new JSDOM(options.content).window.document
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const bodyEl = tocDocument.querySelector('body') as HTMLElement
    bodyEl.innerHTML = tocElement.outerHTML
    options.tocTemplate = tocDocument.documentElement.outerHTML

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')

    headings.forEach((h) => {
      const title = h.textContent || ''
      if (title && title.length) {
        const id = h.id || UID.sync(16)
        const level = h.tagName.substr(1)
        h.id = id
        options.tocContext._toc.push({ id, title, level, href: `#${id}` })
      }
    })
  }
  options.content = document.documentElement.outerHTML
}

export const extractToc = async (
  pdfBuffer: Buffer,
  options: PdfOptions
): Promise<void> => {
  const PAGE_BREAK_MARKER = '\n------page-break------'
  function renderPage(pageData: any) {
    //check documents https://mozilla.github.io/pdf.js/
    const render_options = {
      //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
      normalizeWhitespace: false,
      //do not attempt to combine same line TextItem's. The default value is `false`.
      disableCombineTextItems: false,
    }

    return pageData.getTextContent(render_options).then((textContent: any) => {
      let lastY,
        text = ''
      for (const item of textContent.items) {
        if (lastY == item.transform[5] || !lastY) {
          text += item.str
        } else {
          text += '\n' + item.str
        }
        lastY = item.transform[5]
      }
      return text + PAGE_BREAK_MARKER
    })
  }
  const OPTIONS = {
    pagerender: renderPage,
  }
  const data = await parsePdf(pdfBuffer, OPTIONS)
  data.text
    .split(PAGE_BREAK_MARKER)
    .forEach((content: string, pageIndex: number) => {
      options.tocContext.totalPages = pageIndex + 1
      options.tocContext._toc.map((entry) => {
        if (content.includes(entry.title)) {
          entry.page = options.tocContext.totalPages
        }
        return entry
      })
    })
}

  options.content = document.documentElement.outerHTML
  options.context = {
    ...options.context,
    _toc: tocEntries,
  }
export async function mergePDFs(
  document: Buffer,
  toc: Buffer
): Promise<Uint8Array> {
  const docuPDF = await PDFDocument.load(document)
  const tocPDF = await PDFDocument.load(toc)
  const indices = tocPDF.getPages().map((page, index) => {
    docuPDF.removePage(index)
    return index
  })

  const pages = await docuPDF.copyPages(tocPDF, indices)
  pages.forEach((page, index) => docuPDF.insertPage(index, page))
  return docuPDF.save()
}

export async function enhanceContent(options: PdfOptions) {
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
}

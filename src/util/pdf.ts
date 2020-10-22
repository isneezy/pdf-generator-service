import parsePdf from 'pdf-parse'
import { PdfOptions } from '../services/PdfOptions'
import { PDFDocument } from 'pdf-lib'
import { JSDOM } from 'jsdom'
import * as handlebars from 'handlebars'

const PAGE_BREAK_MARKER = '\n------page-break------'

function pageRender(pageData: any) {
  // check documents https://mozilla.github.io/pdf.js/
  const renderOptions = {
    // replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: false,
    // do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false,
  }

  return pageData.getTextContent(renderOptions).then((textContent: any) => {
    let lastY,
      text = ''
    for (const item of textContent.items) {
      if (!lastY || lastY == item.transform[5]) {
        text += item.str
      } else {
        text += '\n' + item.str
      }
      lastY = item.transform[5]
    }
    return text + PAGE_BREAK_MARKER
  })
}

export const extractPDFToc = async (pdfBuffer: Buffer, options: PdfOptions): Promise<void> => {
  const data = await parsePdf(pdfBuffer, { pagerender: pageRender })
  data.text.split(PAGE_BREAK_MARKER).forEach((content: string, pageIndex: number) => {
    options.tocContext._toc.map((entry) => {
      if (content.includes(entry.id)) {
        entry.page = pageIndex + 1
      }
      return entry
    })
  })

  const document = new JSDOM(options.content).window.document
  const tocElement: HTMLElement | null = document.querySelector('.print-toc')
  document.querySelectorAll('.removeAfterTocExtraction').forEach((el) => el.parentNode?.removeChild(el))
  if (tocElement) {
    tocElement.innerHTML = handlebars.compile(options.tocTemplate || '')({
      ...options.context,
      ...options.tocContext,
    })
    options.tocTemplate = tocElement.outerHTML
  }
  options.content = document.documentElement.outerHTML
}

export async function mergePDFs(document: Buffer, toc: Buffer): Promise<Buffer> {
  const docuPDF = await PDFDocument.load(document)
  const tocPDF = await PDFDocument.load(toc)
  const indices = tocPDF.getPages().map((page, index) => {
    docuPDF.removePage(0)
    return index
  })

  const pages = await docuPDF.copyPages(tocPDF, indices)
  pages.forEach((page, index) => docuPDF.insertPage(index, page))
  const data = await docuPDF.save()
  return Buffer.from(data)
}

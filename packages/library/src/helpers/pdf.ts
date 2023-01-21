import { Options } from "../index";
import parsePDF from 'pdf-parse'
import { JSDOM } from "jsdom";
import * as handlebars from "handlebars";
import { TOC_CONTAINER_SELECTOR } from "./dom";

const PAGE_BREAK_MARKER = '\n------page-break------'

export type TableOfContents = {
  items: { id: string, title: string, level: number, href: string, page?: number }[]
  template?: string
}

const pageRender = (pageData: any) => {
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

/**
 * Reads the generated PDF document and try to discovery page numbers
 * to be filled on the table of contents
 * @internal
 */
export const extractTableOfContentFromPdfDocument = async (pdfBuffer: Buffer, tableOfContents: TableOfContents, options: Options) => {
  const data = await parsePDF(pdfBuffer, { pagerender: pageRender })

  data.text.split(PAGE_BREAK_MARKER).forEach((content: string, pageIndex: number) => {
    tableOfContents.items.map((entry) => {
      if (content.includes(entry.id)) {
        entry.page = pageIndex + 1
      }
      return entry
    })
  })

  const document = new JSDOM(options.template).window.document
  const tocElement: HTMLElement | null = document.querySelector(TOC_CONTAINER_SELECTOR)
  document.querySelectorAll('.removeAfterTocExtraction').forEach((el) => el.parentNode?.removeChild(el))
  if (tocElement) {
    tocElement.innerHTML = handlebars.compile(tableOfContents.template || '')({
      ...options.context,
      _toc: tableOfContents.items,
    })
    tableOfContents.template = tocElement.outerHTML
  }
  options.template = document.documentElement.outerHTML
}
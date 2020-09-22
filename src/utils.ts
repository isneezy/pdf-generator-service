import { PdfOptions } from './services/PdfOptions'
import handlebars from 'handlebars'

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

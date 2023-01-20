import _inlineCss from 'inline-css'
import { Options } from "../index";
import { JSDOM } from 'jsdom'
import * as handlebars from "handlebars";

// constants declarations
const HEADER_TEMPLATE_SELECTOR = '.document-header'
const FOOTER_TEMPLATE_SELECTOR = '.document-footer'

const PUPPETEER_PAGE_NUMBER_TEMPLATE = '<span class="pageNumber"></span>'
const PUPPETEER_TOTAL_PAGES_TEMPLATE = '<span class="totalPages"></span>'

const PAGE_NUMBER_UUID = '8bb89457-fa39-4a4b-9687-57effe459abe'
const TOTAL_PAGES_UUID = 'b9eecb9b-5f64-4091-b8b7-d0ff7c167763'

/**
 * Replaces uuids inside a template string with the correct puppeteer header
 * or footer template variable. This is needed to avoid tripple mustache for templating
 * @param template
 */
const uuidsToPuppeteerVariables = (template: string) => {
  return template
    .replace(PAGE_NUMBER_UUID, PUPPETEER_PAGE_NUMBER_TEMPLATE)
    .replace(TOTAL_PAGES_UUID, PUPPETEER_TOTAL_PAGES_TEMPLATE)
}

/**
 * Takes html template and inlines the CSS properties into the style attribute.
 * @param template the html template
 * @param url how to resolve urls
 */
export const inlineCss = (template?: string, url = ''): Promise<string> => {
  if (!url) url = '_'
  if (!template) return Promise.resolve('')

  return _inlineCss(template, {
    applyLinkTags: true,
    applyStyleTags: true,
    applyTableAttributes: true,
    applyWidthAttributes: true,
    extraCss: '',
    preserveMediaQueries: true,
    removeHtmlSelectors: true,
    removeLinkTags: true,
    removeStyleTags: true,
    url,
  })
}

/**
 * Extracts header and footer templates if present on the html template
 * Then compiles the template to be further be rendered into the PDF document
 * This function mutates te original options object by updating headerTemplate, footerTemplate and template options
 * @param options object containing options of the PdfGenerator
 */
export const extractHeaderAndFooter = (options: Options) => {
  const document = new JSDOM(options.template).window.document
  const headerElement = document.querySelector(HEADER_TEMPLATE_SELECTOR)
  const footerElement = document.querySelector(FOOTER_TEMPLATE_SELECTOR)

  const context = { ...options.context, pageNumber: PAGE_NUMBER_UUID, totalPages: TOTAL_PAGES_UUID }

  if (!options.headerTemplate && headerElement) {
    options.headerTemplate = uuidsToPuppeteerVariables(
      handlebars.compile(headerElement.outerHTML)(context)
    )
    headerElement.remove()
  }

  if (!options.footerTemplate && footerElement) {
    options.footerTemplate = uuidsToPuppeteerVariables(
      handlebars.compile(footerElement.outerHTML)(context)
    )
    footerElement.remove()
  }

  options.template = document.documentElement.outerHTML
}
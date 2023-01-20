import puppeteer, { Browser, PaperFormat } from 'puppeteer'
import * as handlebars from "handlebars";
import { extractHeaderAndFooter, inlineCss } from "./helpers/dom";
import { getFileContents } from "./helpers/url";

const DEFAULT_GOTO_PAGE = 'about:blank'
const EMPTY_HTML_CONTENT = '<html><head></head><body></body></html>'
const DEFAULT_RESPONSE_OBJECT = { contentType: 'text/html', body: EMPTY_HTML_CONTENT }

export type Options = {
  /* URL to the HTML content/handlebars template to be converted to PDF. */
  goto?: string
  /* handlebars template to be converted to PDF */
  template?: string
  /* handlebars template to be rendered has page header */
  headerTemplate?: string
  /* handlebars template to be rendered has page footer */
  footerTemplate?: string
  context?: { [key: string]: unknown }
  format?: PaperFormat
}

export default class PdfGenerator {
  private browser: Browser;
  private constructor(browser: Browser) {
    this.browser = browser;
  }

  /**
   * Generates a PDF file based on the given html template and configuration
   * @param options configuration of how the output PDF should be
   */
  public async generate(options: Options) {
    const page = await this.browser.newPage()

    // Set the URL of the browse to match the goto option
    // This is required to resolve assets with relative URLs
    await page.setRequestInterception(true)
    page.once('request', (req) => req.respond(DEFAULT_RESPONSE_OBJECT))
    await page.goto(options.goto || DEFAULT_GOTO_PAGE)
    await page.setRequestInterception(false)

    try {
      // downloads the page content if goto option is set
      if (options.goto) options.template = await getFileContents(options.goto)
      extractHeaderAndFooter(options)
      // compiles the handlebars template if context is set
      if (options.context) options.template = handlebars.compile(options.template)(options.context)
      // downloads external css and inlines every css style
      options.template = await inlineCss(options.template, options.goto)

      await page.setContent(options.template, { waitUntil: 'networkidle0' })

      return await page.pdf({
        displayHeaderFooter: Boolean(options.headerTemplate || options.footerTemplate),
        headerTemplate: options.headerTemplate,
        footerTemplate: options.footerTemplate,
        printBackground: true,
        format: options.format
      })

    } finally {
      await page.close()
    }
  }

  /**
   * Releases all used resources and frees up memory
   */
  public async close (): Promise<void> {
    await this.browser.close()
  }

  /**
   * Creates a new instance of PdfGenerator
   * Note that this method consumes resources use its close method after usage.
   */
  public static async instance(): Promise<PdfGenerator> {
    const browser = await puppeteer.launch()
    return new PdfGenerator(browser)
  }
}

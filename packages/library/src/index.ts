import puppeteer, { Browser, PaperFormat } from 'puppeteer'
import * as handlebars from "handlebars";
import { inlineCss } from "./helpers/dom";
import { getFileContents } from "./helpers/url";

export type Options = {
  /* URL to the HTML content/handlebars template to be converted to PDF. This option */
  goto?: string
  /* handlebars template to be converted to PDF */
  template?: string
  context?: { [key: string]: unknown }
  format?: PaperFormat
}

export class PdfGenerator {
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
    try {
      // downloads the page content if goto option is set
      if (options.goto) options.template = await getFileContents(options.goto)
      // compiles the handlebars template if context is set
      if (options.context) options.template = handlebars.compile(options.template)(options.context)
      // downloads external css and inlines every css style
      options.template = await inlineCss(options.template, options.goto)

      await page.setContent(options.template, { waitUntil: 'networkidle0' })

      return page.pdf()

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

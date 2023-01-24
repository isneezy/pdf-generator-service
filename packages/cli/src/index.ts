#!/usr/bin/env node

import { resolve } from 'path'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import pkg from '../package.json'
import { program } from 'commander'
import PdfGenerator, { Options } from '@isneezy/pdf-generator'

type CliOptions = Omit<Options, 'margin'> & {
  output: string
  margin: string
}

const WORKING_DIRECTORY = process.cwd()

const fileContentOrString = (value?: string): string => {
  if (!value) return ''
  const resolved = resolve(WORKING_DIRECTORY, value)
  if (existsSync(resolved)) {
    return readFileSync(resolved, { encoding: 'utf-8' })
  } else return value
}

const stringToPDFMargin = (value: string): Options['margin'] | undefined => {
  const parts = value.split(',')
  if (parts.length === 1) return { top: parts[0], bottom: parts[0], left: parts[0], right: parts[0] }
  else if (parts.length === 2) return { top: parts[0], bottom: parts[0], left: parts[1], right: parts[1] }
  else if (parts.length === 3) return { top: parts[0], bottom: parts[1], left: parts[2], right: parts[2] }
  else if (parts.length === 4) return { top: parts[0], bottom: parts[1], left: parts[2], right: parts[3] }
}

program
  .name('pdf-generator')
  .version(pkg.version)
  .description(
    `A powerful and versatile command line interface for converting HTML pages, templates, and URLs into high-quality PDF documents with support for table of content.`
  )
  .option(
    '-g, --goto <url>',
    'URL to the HTML/handlebars template to be converted to PDF, if set this takes priority over --template option'
  )
  .option(
    '-t, --template <template>',
    'path to HTML/handlebars template or string containing HTML/handlebars template to be converted to PDF'
  )
  .option(
    '-c, --context <context>',
    'path to json file or json or json string with the data to be passed to the HTML template'
  )
  .option('-f, --format <format>', 'sets paper format type to be used when printing a PDF', 'A4')
  .option(
    '-H, --header-template <headerTemplate>',
    'string containing the template to te header, if set this takes priority over the header template in the document'
  )
  .option(
    '-F, --footer-template <footerTemplate>',
    'string containing the template to te footer, if set this takes priority over the footer template in the document'
  )
  .option('-L, --landscape', 'use this flag to switch the orientation from portrait to landscape', false)
  .option('-M, --margin <margin>', 'Set the page margins', '10mm')
  .requiredOption(
    '-o, --output <output>',
    'path to the output PDF file',
    process.env.ENV === 'dev' ? './generated.pdf' : undefined
  )

  .action(async (cliOptions: CliOptions) => {
    cliOptions.template = fileContentOrString(cliOptions.template)
    cliOptions.headerTemplate = fileContentOrString(cliOptions.headerTemplate)
    cliOptions.footerTemplate = fileContentOrString(cliOptions.footerTemplate)
    cliOptions.output = resolve(process.cwd(), cliOptions.output)

    try {
      cliOptions.context = JSON.parse(fileContentOrString(cliOptions.context as unknown as string))
    } catch (e) {}

    const options: Options = {
      ...cliOptions,
      margin: stringToPDFMargin(cliOptions.margin),
    }

    const instance = await PdfGenerator.instance()
    try {
      const buffer = await instance.generate(options)
      writeFileSync(cliOptions.output, buffer)
    } finally {
      await instance.close()
    }
  })

program.parse()

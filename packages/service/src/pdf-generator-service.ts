import { program } from "commander"
// @ts-ignore
import pkg from '../package.json'
import { createApp } from "./app";
import { GRACEFULLY_EXITING } from "./constants";
import { Server } from "http";

const logLevels = ['info','warn', 'error', 'silent'] as const

type CliOptions = {
  port: number
  cors: boolean
  logLevel: typeof logLevels[number]
}

let server: Server | undefined

program
  .name('pdf-generator-service')
  .version(pkg.version)
  .description(
    'A powerful and versatile self-hosted, open-source REST API for converting HTML pages, templates, and URLs into' +
    ' high-quality PDF documents. With `@isneezy/pdf-genertor-service`, you can easily convert HTML files into PDFs' +
    ' with support for table of contents and various page configurations such as page size, margins, and more.'
  )
  .option('-p, --port <port>', 'specify the port in witch the service will be listening', '3000')
  .option('-c, --cors', 'enable cors')
  // .option('-l, --log-level <logLevel>', `specify the log level ${logLevels.join('|')}`, logLevels[0])
  .action(async (cliOptions: CliOptions) => {
    const app = await createApp()
    function handleTearDown() {
      console.info('Attempting gracefully shutdown of the server, waiting for remaining connections to complete.')
      app.set(GRACEFULLY_EXITING, true)
      app.emit(GRACEFULLY_EXITING)

      if (!server) return

      server.close(async () => {
        console.info('No more connections, shutting down.')
        process.exit()
      })

      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down.')
        process.exit(1)
      }, 30 * 100) // 30s
    }

    process.on('SIGINT', handleTearDown)
    process.on('SIGTERM', handleTearDown)

    server = app.listen(cliOptions.port, () => {
      console.log(`${pkg.name} v${pkg.version} is running at http://localhost:${cliOptions.port}`)
    })
  })

program.parse()
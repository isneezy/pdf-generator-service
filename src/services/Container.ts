/* eslint-disable @typescript-eslint/no-explicit-any */
import { Application } from 'express'
import Puppeteer from 'puppeteer'
import Logger, { LogLevel } from 'consola'
import { Pdf } from './pdf'
import pkg from '../../package.json'

export class Container {
  private readonly binds: Record<string, any>
  private readonly promises: Promise<any>[] = []

  private constructor(app: Application) {
    this.binds = {}
    this.bind('app', app)
  }

  public bind<T>(name: string, concrete?: T | Promise<any>): void {
    if (concrete instanceof Promise) {
      this.promises.push(concrete)
      concrete.then(() => {
        const index = this.promises.findIndex((p) => p === concrete)
        this.promises.splice(index, 1)
      })
    } else {
      this.binds[name] = concrete
    }
  }

  resolve<T>(name: string): T {
    const bound = this.binds[name]
    if (typeof bound === 'function') {
      return bound(this)
    } else if (bound) {
      return bound
    }
    throw new Error(`${name} not registered`)
  }

  public static async factory(app: Application): Promise<Container> {
    const container = new Container(app)
    await wire(container)
    return container
  }
}

async function wire(container: Container): Promise<void> {
  const args: string[] = (process.env.PUPPETEER_ARGS || '').split(' ')
  // Produce tagged PDFs, better for accessibility;
  // Hopefully will also produce an Outline (ToC) eventually.
  // See: https://github.com/danburzo/percollate/issues/47

  const browser = await Puppeteer.launch({
    handleSIGINT: false,
    handleSIGTERM: false,
    args: args.concat('--export-tagged-pdf'),
    defaultViewport: {
      // Emulate retina display (@2x)...
      deviceScaleFactor: 2,
      // ...but then we need to provide the other
      // viewport parameters as well
      width: 1920,
      height: 1080,
    },
  })

  const pdf = new Pdf(browser)
  container.bind('pdf', pdf)
  container.bind('browser', browser)

  const logger = Logger.withTag(pkg.name).create({
    level:
      process.env.NODE_ENV === 'production' ? LogLevel.Warn : LogLevel.Debug,
  })

  container.bind('logger', logger)
}

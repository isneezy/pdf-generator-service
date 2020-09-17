/* eslint-disable @typescript-eslint/no-explicit-any */
import { Application } from 'express'
import Puppeteer from 'puppeteer'
import Logger, { LogLevel } from 'consola'
import { Pdf } from './pdf'
import pkg from '../../package.json'

export class Container {
  private readonly binds: Record<string, any>

  private constructor(app: Application) {
    this.binds = {}
    this.bind('app', app)
  }

  public bind<T>(name: string, concrete?: T): void {
    this.binds[name] = concrete
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

  public static factory(app: Application): Container {
    const container = new Container(app)
    wire(container)
    return container
  }
}

function wire(container: Container): void {
  Puppeteer.launch({ handleSIGINT: false, handleSIGTERM: false }).then(
    (browser) => {
      const pdf = new Pdf(browser)
      container.bind('pdf', pdf)
      container.bind('browser', browser)
    }
  )
  const logger = Logger.withTag(pkg.name).create({
    level:
      process.env.NODE_ENV === 'production' ? LogLevel.Warn : LogLevel.Debug,
  })
  container.bind('logger', logger)
}

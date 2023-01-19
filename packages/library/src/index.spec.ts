import { Options, PdfGenerator } from "./index";
import { jest, describe, it, expect } from '@jest/globals'
import puppeteer from "puppeteer";

const mockedPage = {
  pdf: jest.fn(),
  setContent: jest.fn()
}

const mockedBrowser = {
  newPage: jest.fn(() => mockedPage),
  close: jest.fn()
}
jest.mock('puppeteer', () => ({
  launch: jest.fn(() => mockedBrowser),
}))

describe('src/index.ts', () => {
  it('should correctly create an instance of PdfGenerator', async () => {
    const instance = await PdfGenerator.instance()
    expect(instance).toBeInstanceOf(PdfGenerator)
  })
  it('should free all used resources', async () => {
    const instance = await PdfGenerator.instance()
    await instance.close()
    expect(mockedBrowser.close).toHaveBeenCalled()
  })
  it('should generate pdf document from a given html content', async () => {
    const template = '<p>Hello from {{ name }}</p>'
    const context = { name: 'PDF Generator' }
    const options: Options = { template, context }
    const instance = await PdfGenerator.instance()
    await instance.generate(options)
    expect(mockedPage.setContent).lastCalledWith(
      expect.stringMatching(/<p>Hello from PDF Generator<\/p>/),
      { waitUntil: 'networkidle0' }
    )
    expect(mockedPage.pdf).toHaveBeenCalled()
  })
})

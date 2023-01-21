import PdfGenerator, { Options } from "./index";
import { jest, describe, it, expect } from '@jest/globals'
import puppeteer from "puppeteer";
import axios from "axios";
import fs from "fs";
import path from "path";

const mockedPdfBuffer = fs.readFileSync(path.join(__dirname, '../stub/paginated.pdf'))

const mockedPage = {
  pdf: jest.fn(() => Promise.resolve(mockedPdfBuffer)),
  setContent: jest.fn(),
  goto: jest.fn(),
  setRequestInterception: jest.fn(),
  once: jest.fn(),
  close: jest.fn()
}

const mockedBrowser = {
  newPage: jest.fn(() => mockedPage),
  close: jest.fn()
}

jest.mock('axios')
jest.mock('puppeteer', () => ({
  launch: jest.fn(() => mockedBrowser),
}))

describe('src/index.ts', () => {
  it('should correctly create an instance of PdfGenerator', async () => {
    // given when
    const instance = await PdfGenerator.instance()
    // then
    expect(instance).toBeInstanceOf(PdfGenerator)
  })

  it('should free all used resources', async () => {
    // given
    const instance = await PdfGenerator.instance()
    // when
    await instance.close()
    // then
    expect(mockedBrowser.close).toHaveBeenCalled()
  })

  it('should generate PDF document from a given html content', async () => {
    // given
    const template = '<div id="table-of-contents"></div><h1 id="hFUqW5f6UoBl7D1gG1T8Sw">Hello from {{ name }}</h1>'
    const context = { name: 'PDF Generator' }
    const options: Options = { template, context }
    const instance = await PdfGenerator.instance()
    // when
    await instance.generate(options)
    // then
    expect(mockedPage.setContent).lastCalledWith(
      expect.stringMatching(/<h1 id="hFUqW5f6UoBl7D1gG1T8Sw">Hello from PDF Generator/),
      { waitUntil: 'networkidle0' }
    )
    expect(mockedPage.pdf).toHaveBeenCalled()
  })

  it('should generate PDF document from given goto URL', async () => {
    // given
    jest.mocked(axios).get.mockResolvedValueOnce({ data: '<p>hello from goto page</p>' })
    const goto = 'https://www.example.com'
    const instance = await PdfGenerator.instance()
    // when
    await instance.generate({ goto })
    // then
    expect(mockedPage.setContent).toBeCalledWith(expect.stringContaining('<p>hello from goto page</p>'), { "waitUntil": "networkidle0" })
  })
})

import PdfGenerator, { Options } from './index'
import { vi, describe, it, expect } from 'vitest'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

const mockedPdfBuffer = fs.readFileSync(path.join(__dirname, '../stub/paginated.pdf'))

const mockedPage = {
  pdf: vi.fn(() => Promise.resolve(mockedPdfBuffer)),
  setContent: vi.fn(),
  goto: vi.fn(),
  setRequestInterception: vi.fn(),
  once: vi.fn(),
  close: vi.fn(),
}

const mockedBrowser = {
  newPage: vi.fn(() => mockedPage),
  close: vi.fn(),
}

vi.mock('axios')
vi.mock('puppeteer', () => ({
  default: {
    launch: vi.fn(() => mockedBrowser),
  },
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
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: '<p>hello from goto page</p>' })
    const goto = 'https://www.example.com'
    const instance = await PdfGenerator.instance()
    // when
    await instance.generate({ goto })
    // then
    expect(mockedPage.setContent).toBeCalledWith(expect.stringContaining('<p>hello from goto page</p>'), {
      waitUntil: 'networkidle0',
    })
  })
})

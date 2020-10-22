import puppeteer, { PDFOptions } from 'puppeteer'
import { Pdf } from '../Pdf'
import { mocked } from 'ts-jest/utils'
import { PdfOptions, pdfOptionsFactory } from '../PdfOptions'

jest.mock('../../util/pdf')

const pageProto = {
  setContent: jest.fn().mockImplementation(() => Promise.resolve()),
  pdf: jest.fn().mockImplementation(() => Promise.resolve()),
  close: jest.fn().mockImplementation(() => Promise.resolve()),
}

const browserProto = {
  newPage: jest.fn().mockImplementation(async () => pageProto),
}

jest.mock('puppeteer', () => ({
  launch: async () => browserProto,
}))

async function testPdfParam(options: Partial<PdfOptions>, pdfOptions: PDFOptions) {
  browserProto.newPage.mockClear()
  pageProto.close.mockClear()
  pageProto.pdf.mockClear()

  const mockedPuppeteer = mocked(puppeteer)
  const browser = await mockedPuppeteer.launch()
  const pdf = new Pdf(browser)
  await pdf.generate(pdfOptionsFactory(Object.assign({ content: '<h2>Hello</h2>' }, options)))
  expect(browserProto.newPage).toBeCalledTimes(1)
  expect(pageProto.pdf).toBeCalledTimes(1)
  expect(pageProto.close).toBeCalledTimes(1)
  expect(pageProto.pdf).lastCalledWith(expect.objectContaining(pdfOptions))
}

describe('Pdf', () => {
  it('initializes', async () => {
    const mockedPuppeteer = mocked(puppeteer)
    const browser = await mockedPuppeteer.launch()
    expect(new Pdf(browser)).toBeInstanceOf(Pdf)
  })

  it('renders templates when context is available', async () => {
    const mockedPuppeteer = mocked(puppeteer)
    const browser = await mockedPuppeteer.launch()
    const pdf = new Pdf(browser)
    await pdf.generate(
      pdfOptionsFactory({
        content: '<h2 id="myId">Hello {{ name }}</h2>',
        context: { name: 'Express PDF Generator' },
      })
    )

    expect(pageProto.setContent).lastCalledWith(
      expect.stringMatching(/<h2 id="myId">Hello Express PDF Generator<\/h2>/),
      expect.any(Object)
    )
  })

  it('generates portrait pdf', async () => {
    await testPdfParam({ orientation: 'portrait' }, { landscape: false })
  })

  it('generates landscape pdf', async () => {
    await testPdfParam({ orientation: 'landscape' }, { landscape: true })
  })

  it('generates toc when .print-toc template is available', async () => {
    const mockedPuppeteer = mocked(puppeteer)
    const browser = await mockedPuppeteer.launch()
    const pdf = new Pdf(browser)
    await pdf.generate(
      pdfOptionsFactory({
        content: `
        <div class="print-toc"></div>
        <h2 id="myId">Hello {{ name }}</h2>`,
        context: { name: 'Express PDF Generator' },
      })
    )
  })
})

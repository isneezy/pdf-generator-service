import puppeteer, { PDFOptions } from 'puppeteer'
import { Pdf } from '../pdf'
import { mocked } from 'ts-jest/utils'
import { PdfOptions, pdfOptionsFactory } from '../PdfOptions'

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

async function testPdfParam(
  options: Partial<PdfOptions>,
  pdfOptions: PDFOptions
) {
  browserProto.newPage.mockClear()
  pageProto.close.mockClear()
  pageProto.pdf.mockClear()

  const mockedPuppeteer = mocked(puppeteer)
  const browser = await mockedPuppeteer.launch()
  const pdf = new Pdf(browser)
  await pdf.generate(
    pdfOptionsFactory(Object.assign({ content: '<h2>Hello</h2>' }, options))
  )
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
        content: '<h2>Hello {{ name }}</h2>',
        context: { name: 'Express PDF Generator' },
      })
    )

    expect(pageProto.setContent).lastCalledWith(
      '<h2>Hello Express PDF Generator</h2>',
      expect.any(Object)
    )
  })

  it('generates portrait pdf', async () => {
    await testPdfParam({ orientation: 'portrait' }, { landscape: false })
  })

  it('generates landscape pdf', async () => {
    await testPdfParam({ orientation: 'landscape' }, { landscape: true })
  })

  it('should wrap header and footer templates', async () => {
    const footer = '<span>This is a footer</span>'
    const wrappedFooter =
      '<div style="font-size: 8px"><span>This is a footer</span></div>'
    const header = '<span>This is a header</span>'
    const wrappedHeader =
      '<div style="font-size: 8px"><span>This is a header</span></div>'

    await testPdfParam(
      { footer, header },
      {
        footerTemplate: wrappedFooter,
        headerTemplate: wrappedHeader,
        displayHeaderFooter: true,
      }
    )
  })
})

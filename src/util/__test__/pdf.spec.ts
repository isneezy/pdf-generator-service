import fs from 'fs'
import path from 'path'
import { pdfOptionsFactory } from '../../services/PdfOptions'
import { extractPDFToc, mergePDFs } from '../pdf'

describe('/src/util/pdf.ts', () => {
  it('should extract page numbers for TOCs', async () => {
    const options = pdfOptionsFactory({
      content: '<p></p>',
      tocContext: {
        _toc: [
          { id: '', title: 'Page 1', href: '', level: 1 },
          { id: '', title: 'Page 2', href: '', level: 1 },
          { id: '', title: 'Page 3', href: '', level: 1 },
        ],
      },
    })

    const pdfBuffer = fs.readFileSync(path.join(__dirname, '/sample.pdf'))
    await extractPDFToc(pdfBuffer, options)
    expect(options.tocContext._toc).toStrictEqual([
      expect.objectContaining({ page: 1 }),
      expect.objectContaining({ page: 2 }),
      expect.objectContaining({ page: 3 }),
    ])
  })
  it('should merge two PDF files', async () => {
    const pdfBuffer = fs.readFileSync(path.join(__dirname, '/sample.pdf'))
    const pdfBuffer2 = fs.readFileSync(path.join(__dirname, '/sample.pdf'))
    const result = await mergePDFs(pdfBuffer, pdfBuffer2)

    expect(result).toBeInstanceOf(Buffer)
  })
})

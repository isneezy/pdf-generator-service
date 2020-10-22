import fs from 'fs'
import path from 'path'
import { pdfOptionsFactory } from '../../services/PdfOptions'
import { extractPDFToc, mergePDFs } from '../pdf'

describe('/src/util/pdf.ts', () => {
  it('should extract page numbers for TOCs', async () => {
    const options = pdfOptionsFactory({
      content: `
        <div class="print-toc"></div>
        <h1 id="1">Page 1<span class="removeAfterTocExtraction">Page 1</span></h1>
        <h1 id="2">Page 2<span class="removeAfterTocExtraction">Page 2</span></h1>
        <h1 id="3">Page 3<span class="removeAfterTocExtraction">Page 3</span></h1>
      `,
      tocContext: {
        _toc: [
          { id: 'Page 1', title: 'Page 1', href: '', level: 1 },
          { id: 'Page 2', title: 'Page 2', href: '', level: 1 },
          { id: 'Page 3', title: 'Page 3', href: '', level: 1 },
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
    expect(options.content).not.toContain('<span class="removeAfterTocExtraction">Page 1</span>')
    expect(options.content).not.toContain('<span class="removeAfterTocExtraction">Page 2</span>')
    expect(options.content).not.toContain('<span class="removeAfterTocExtraction">Page 3</span>')
  })
  it('should merge two PDF files', async () => {
    const pdfBuffer = fs.readFileSync(path.join(__dirname, '/sample.pdf'))
    const pdfBuffer2 = fs.readFileSync(path.join(__dirname, '/sample.pdf'))
    const result = await mergePDFs(pdfBuffer, pdfBuffer2)

    expect(result).toBeInstanceOf(Buffer)
  })
})

import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { extractTableOfContentFromPdfDocument, TableOfContents } from './pdf'

describe('src/helpers/pdf.ts', () => {
  describe('table of contents', () => {
    it('should extract page numbers from PDF file for table of contents', async () => {
      // given
      const options = {
        template: `
        <div id="table-of-contents"><p></p></div>
        <h1 id="page-1">Page 1<span class="removeAfterTocExtraction">page-1</span></h1>
        <h1 id="page-2">Page 2<span class="removeAfterTocExtraction">page-2</span></h1>
        <h1 id="page-3">Page 3<span class="removeAfterTocExtraction">page-3</span></h1>
      `,
      }

      const tableOfContents: TableOfContents = {
        template: '<p>toc</p>',
        items: [
          { id: 'page-1', title: 'Page 1', href: '#page-1', level: 1 },
          { id: 'page-2', title: 'Page 2', href: '#page-2', level: 1 },
          { id: 'page-3', title: 'Page 3', href: '#page-3', level: 1 },
        ],
      }

      const pdfBuffer = fs.readFileSync(path.join(__dirname, '../../stub/paginated.pdf'))
      // when
      await extractTableOfContentFromPdfDocument(pdfBuffer, tableOfContents, options)
      // then
      expect(tableOfContents.items).toStrictEqual([
        expect.objectContaining({ page: 2 }),
        expect.objectContaining({ page: 3 }),
        expect.objectContaining({ page: 4 }),
      ])
      expect(options.template).not.toContain('class="removeAfterTocExtraction"')
    })
  })
})

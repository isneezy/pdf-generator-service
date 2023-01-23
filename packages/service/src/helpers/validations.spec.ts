import { describe, it, expect } from 'vitest'
import { PDFOptionsSchema } from './validation'

describe('src/helpers/validation', () => {
  it('should validate goto parameter as url', () => {
    expect(() => PDFOptionsSchema.validateSync({ goto: 'hello.com' })).to.throw('goto must be a valid URL')
  })

  it('should request template parameter when goto is not present', () => {
    expect(() => PDFOptionsSchema.validateSync({})).to.throw('template is required when goto is not present')
  })

  it('should only allow specified formats value', () => {
    expect(() =>
      PDFOptionsSchema.validateSync({
        template: 'hello',
        format: 'A16',
      })
    ).to.throw(/letter, legal, tabloid, ledger, a0, a1, a2, a3, a4, a5, a6/)
  })

  it('should validate margins', () => {
    expect(() =>
      PDFOptionsSchema.validateSync({
        template: 'hello',
        margin: {},
      })
    ).to.throw(/margin.right is a required field/)
  })
})

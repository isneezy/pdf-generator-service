import { validatePayload } from '../payloadValidator'

describe('src/payloadValidator.ts', () => {
  it('should only allow payload with one of content or goto options exclusively', () => {
    let errors = validatePayload({})
    expect(errors.content[0]).toMatch(/html filed is required /)
    errors = validatePayload({ content: '<htm></htm>>', goto: 'https://example.com' })
    expect(Object.keys(errors).length).toBe(0)
  })
})

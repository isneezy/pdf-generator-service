import { jest, describe, it, expect } from "@jest/globals";
import { inlineCss } from "./dom";

describe('src/helpers/dom.ts', () => {
  it('should inline css properties from style tag', async () => {
    const template = '<style>div{ color: #fff; }</style><div>Hello</div><p>Hello</p>'
    const output = await inlineCss(template)
    expect(output).toBe("<html><head></head><body><div style=\"color: #fff;\">Hello</div><p>Hello</p></body></html>")
  })
})
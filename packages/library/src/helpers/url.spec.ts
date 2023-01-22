import { vi, describe, it, expect } from "vitest";
import axios from "axios";
import { getFileContents } from "./url";

vi.mock('axios')
describe('src/helpers/url.ts', () => {
  it('should download contents from a given url', async () => {
    const url = 'https://example.com'
    vi.mocked(axios, true).get.mockResolvedValue({ data: 'hello' })
    const value = await getFileContents(url)
    expect(value).toBe('hello')
  })
})
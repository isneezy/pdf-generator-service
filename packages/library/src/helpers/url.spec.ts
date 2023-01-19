import { jest, describe, it, expect } from "@jest/globals";
import axios from "axios";
import { getFileContents } from "./url";

jest.mock('axios')
describe('src/helpers/url.ts', () => {
  it('should download contents from a given url', async () => {
    const url = 'https://example.com'
    jest.mocked(axios).get.mockResolvedValue({ data: 'hello' })
    const value = await getFileContents(url)
    expect(value).toBe('hello')
  })
})
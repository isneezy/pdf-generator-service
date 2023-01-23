import { describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { createApp } from './app'
import { GRACEFULLY_EXITING } from './constants'
import pkg from '../package.json'

const instance = {
  generate: vi.fn(),
  close: vi.fn(),
}

vi.mock('@isneezy/pdf-generator', () => ({
  default: {
    instance: vi.fn(() => instance),
  },
}))

describe('src/app.ts', () => {
  it('should release resources while gracefully exiting', async () => {
    const app = await createApp()
    app.emit(GRACEFULLY_EXITING)
    expect(instance.close).to.toHaveBeenCalled()
  })

  describe('GET /', () => {
    it('should shows application name, description, version, author, repository, author and bugs on root path', async () => {
      const app = await createApp()
      const response = request(app).get('/')
      response.expect('Content-Type', /json/).expect(200, {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        homepage: pkg.homepage,
        author: pkg.author,
        repository: pkg.repository,
        bugs: pkg.bugs,
      })
    })
  })

  describe('GET /v1/generate', () => {
    it('should generate and stream pdf file based on html input', async () => {
      const app = await createApp()
      instance.generate.mockResolvedValue('Hello')
      await request(app)
        .get('/v1/generate?template=<h2>Hello</h2>')
        .expect('Content-Type', /pdf/)
        .expect(200)
        .expect((response) => expect(response.body.toString()).toBe('Hello'))
    })
  })

  describe('POST /v1/generate', () => {
    it('should generate and stream pdf file based on html input', async () => {
      const app = await createApp()
      instance.generate.mockResolvedValue('Hello')
      await request(app)
        .post('/v1/generate')
        .send({ template: '<h2>Hello</h2>' })
        .expect('Content-Type', /pdf/)
        .expect(200)
        .expect((response) => expect(response.body.toString()).toBe('Hello'))
    })
    it('should return 422 if there is any validation error', async () => {
      const app = await createApp()
      await request(app)
        .post('/v1/generate')
        .send({})
        .expect('Content-Type', /json/)
        .expect(422)
        .expect((response) => expect(response.body.errors[0]).toBe('template is required when goto is not present'))
    })
    it('should return 500 there is any other error occurred', async () => {
      instance.generate.mockRejectedValue(new Error('test message'))
      const app = await createApp()
      await request(app)
        .post('/v1/generate')
        .send({ template: '<p>Test</p>' })
        .expect('Content-Type', /json/)
        .expect(500)
        .expect((response) => expect(response.body.message).toBe('Internal server error'))
    })
  })
})

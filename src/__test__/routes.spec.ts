import request from 'supertest'
import pkg from '../../package.json'
import createApp, { CreateAppReturnType } from '../app'
import Puppeteer, { Browser } from 'puppeteer'

let instance: CreateAppReturnType | undefined

beforeAll(async () => {
  instance = await createApp()
})

afterAll(async () => {
  await instance?.container.resolve<Browser>('browser').close()
})

describe('GET /', () => {
  it('shows application name, description, version, author, repository, author and bugs on root path', (done) => {
    const response = request(instance?.app).get('/')
    response.expect('Content-Type', /json/).expect(
      200,
      {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        homepage: pkg.homepage,
        author: pkg.author,
        repository: pkg.repository,
        bugs: pkg.bugs,
      },
      done
    )
  })
})

describe('POST /generate', () => {
  it('should generate and stream pdf file based on html input', async (done) => {
    await request(instance?.app)
      .post('/generate')
      .send({ content: '<h2>Hello</h2>' })
      .expect('Content-Type', /pdf/)
      .expect(200)
    done()
  })
})

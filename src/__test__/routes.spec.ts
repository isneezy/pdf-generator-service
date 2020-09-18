import request from 'supertest'
import pkg from '../../package.json'
import { app, container } from '../app'
import Puppeteer, { Browser } from 'puppeteer'

describe('GET /', () => {
  it('shows application name, description, version, author, repository, author and bugs on root path', (done) => {
    const response = request(app).get('/')
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
    // dirty hack to fix missing dependency on ioc
    const args: string[] = (process.env.PUPPETEER_ARGS || '').split(' ')
    const browser = await Puppeteer.launch({ args })
    await request(app)
      .post('/generate')
      .send({ content: '<h2>Hello</h2>' })
      .expect('Content-Type', /pdf/)
      .expect(200)

    // cleanup resources
    await container.resolve<Browser>('browser').close()
    await browser.close()
    done()
  })
})

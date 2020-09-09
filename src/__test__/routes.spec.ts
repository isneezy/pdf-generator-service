import request from 'supertest'
import pkg from '../../package.json'
import { app, server } from "../index";
import Puppeteer from 'puppeteer'

describe('GET /', () => {
  it('shows application name, description, version, author, repository, author and bugs on root path', done => {
    const response = request(app).get('/')
    response
      .expect('Content-Type', /json/)
      .expect(200, {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        homepage: pkg.homepage,
        author: pkg.author,
        repository: pkg.repository,
        bugs: pkg.bugs
      }, done)
  });
})

describe('POST /generate', () => {
  it('should generate and stream pdf file based on html input', async done => {
    // dirty hack to fix missing dependency on ioc
    const browser = await Puppeteer.launch()

    request(app)
      .post('/generate')
      .send({ html: '<h2>Hello</h2>' })
      .expect('Content-Type', /pdf/)
      .expect(200, async () => {
        await browser.close() // cleanup resources
        done()
      })
  })
})

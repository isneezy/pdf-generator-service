import request from 'supertest'
import { app, server } from "../index";

afterAll(() => server.close())

describe('GET /', () => {
  it('shows tag and version on root path', done => {
    const response = request(app).get('/')
    response
      .expect('Content-Type', /json/)
      .expect(200, {
        tag: 'PDF Generator',
        version: process.env.npm_package_version
      }, done)
  });
})

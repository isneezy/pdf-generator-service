import { describe, expect, it, vi } from 'vitest'
import { GRACEFULLY_EXITING } from './constants'

const mockedServer = {
  close: vi.fn(),
}

const mockedApp = {
  listen: vi.fn(() => mockedServer),
  set: vi.fn(),
  emit: vi.fn(),
}

vi.mock('./app.ts', () => ({
  createApp: async () => mockedApp,
}))

const execute = () => import('./pdf-generator-service?v' + Number(new Date()))

describe('src/pdf-generator-service.ts', () => {
  it('should gracefully shutdown the server on SIGINT', async () => {
    await execute()
    process.emit('SIGINT')
    expect(mockedServer.close).toHaveBeenCalled()
    expect(mockedApp.set).toHaveBeenCalledWith(GRACEFULLY_EXITING, true)
    expect(mockedApp.emit).toHaveBeenCalledWith(GRACEFULLY_EXITING)
  })
})

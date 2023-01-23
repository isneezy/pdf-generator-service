import { describe, expect, it, vi } from 'vitest'

vi.mock('fs')

const instance = {
  generate: vi.fn(),
  close: vi.fn(),
}

vi.mock('@isneezy/pdf-generator', () => ({
  default: {
    instance: vi.fn(() => instance),
  },
}))

const executeCLI = async () => import('./index?version=' + Number(new Date()))

describe('src/index.ts', () => {
  it('should generate pdf files from a given parameters', async () => {
    // given
    const goto = 'https://example.com'
    const template = '<p>My template</p>'
    const context = { value: 'My template variables' }
    const format = 'A5'
    const headerTemplate = '<p>Header template</p>'
    const footerTemplate = '<p>Footer template</p>'

    process.argv = [
      ...process.argv,
      '-o',
      'generated.pdf',
      '-g',
      'https://example.com',
      '-t',
      template,
      '-c',
      JSON.stringify(context),
      '-f',
      format,
      '-H',
      headerTemplate,
      '-F',
      footerTemplate,
    ]
    // when
    await executeCLI()
    // then
    expect(instance.generate).toHaveBeenCalledWith(
      expect.objectContaining({ goto, template, context, format, headerTemplate, footerTemplate })
    )
  })
  it('should accept multiple page margin formats', async () => {
    // single value for all sides
    process.argv = [...process.argv, '-o', 'generated.pdf', '-M', '30mm']
    await executeCLI()
    expect(instance.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        margin: {
          top: '30mm',
          bottom: '30mm',
          left: '30mm',
          right: '30mm',
        },
      })
    )
    // top-bottom,left-right format
    process.argv = [...process.argv, '-o', 'generated.pdf', '-M', '30mm,20mm']
    await executeCLI()
    expect(instance.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        margin: {
          top: '30mm',
          bottom: '30mm',
          left: '20mm',
          right: '20mm',
        },
      })
    )
    // top,bottom,left-right format
    process.argv = [...process.argv, '-o', 'generated.pdf', '-M', '30mm,20mm,15mm']
    await executeCLI()
    expect(instance.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        margin: {
          top: '30mm',
          bottom: '20mm',
          left: '15mm',
          right: '15mm',
        },
      })
    )
    // top,bottom,left,right format
    process.argv = [...process.argv, '-o', 'generated.pdf', '-M', '30mm,20mm,15mm,10mm']
    await executeCLI()
    expect(instance.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        margin: {
          top: '30mm',
          bottom: '20mm',
          left: '15mm',
          right: '10mm',
        },
      })
    )
  })
})

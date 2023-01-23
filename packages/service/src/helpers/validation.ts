import { object, string, boolean } from 'yup'

const lowercasePageFormats = ['letter', 'legal', 'tabloid', 'ledger', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6']
const pageFormats = lowercasePageFormats.concat(lowercasePageFormats.map((format) => format.toUpperCase()))

const format = string().default('A4').oneOf(pageFormats)

const margin = object({
  top: string().required(),
  bottom: string().required(),
  left: string().required(),
  right: string().required(),
}).default({
  top: '10mm',
  bottom: '10mm',
  left: '10mm',
  right: '10mm',
})

export const PDFOptionsSchema = object({
  goto: string().url().nullable(),
  template: string()
    .nullable()
    .when('goto', {
      is: (goto?: string) => !!goto && !!goto.trim().length,
      then: (schema) => schema,
      otherwise: (schema) => schema.required('template is required when goto is not present'),
    }),
  headerTemplate: string().nullable(),
  footerTemplate: string().nullable(),
  context: object().nullable(),
  format,
  landscape: boolean().default(false),
  margin,
})

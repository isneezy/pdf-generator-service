export function validatePayload(body: Record<string, string> = {}): Record<string, string[]> {
  const errors: Record<string, string[]> = {}
  if (!body.content) {
    errors.content = ['html filed is required.']
  }
  if (body.content && body.content.includes('<script')) {
    errors.content = errors.content || []
    errors.content.push('scripting is not allowed.')
  }

  return errors
}

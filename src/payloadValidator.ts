export function validatePayload(body: Record<string, string> = {}): Record<string, string[]> {
  const errors: Record<string, string[]> = {}
  if (!body.content && !body.goto) {
    errors.content = ['html filed is required when goto is not present.']
  }
  if (body.content && body.content.includes('<script')) {
    errors.content = errors.content || []
    errors.content.push('scripting is not allowed.')
  }

  return errors
}

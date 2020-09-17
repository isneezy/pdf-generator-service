export function validatePayload(body: any = {}): Record<string, string[]> {
  const errors: Record<string, string[]> = {}
  if (!body.html) {
    errors.html = ['html filed is required.']
  }
  if (body.html && body.html.includes('<script')) {
    errors.html = errors.html || []
    errors.html.push("scripting is not allowed.")
  }

  return errors
}

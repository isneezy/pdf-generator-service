import _inlineCss from 'inline-css'
/**
 * Takes html template and inlines the CSS properties into the style attribute.
 * @param template the html template
 * @param url how to resolve urls
 */
export const inlineCss = (template?: string, url = ''): Promise<string> => {
  if (!url) url = '_'
  if (!template) return Promise.resolve('')

  return _inlineCss(template, {
    applyLinkTags: true,
    applyStyleTags: true,
    applyTableAttributes: true,
    applyWidthAttributes: true,
    extraCss: '',
    preserveMediaQueries: true,
    removeHtmlSelectors: true,
    removeLinkTags: true,
    removeStyleTags: true,
    url,
  })
}
# Express PDF Generator Service


[![Build Status](https://img.shields.io/github/actions/workflow/status/isneezy/pdf-generator-service/node.js.yml?branch=master&logo=github)](https://github.com/isneezy/pdf-generator-service/tree/next)
[![Docker Repository on Quay](https://quay.io/repository/isneezy/pdf-generator-service/status "Docker Repository on Quay")](https://quay.io/repository/isneezy/pdf-generator-service)
[![Coverage Status](https://coveralls.io/repos/github/isneezy/pdf-generator-service/badge.svg?branch=master)](https://coveralls.io/github/isneezy/pdf-generator-service?branch=master)

> ☝️ A next version with better performance and features is coming soon.  
> To try it out, check its documentation in the
> [next branch](https://github.com/isneezy/pdf-generator-service/tree/next).

A simple express service that generates a pdf based on the submitted HTML using Chromium and Puppeteer.

## Getting started
#### Running locally
```bash
## build
yarn install
yarn build
## Running the server
node ./dist/src/index.js
## Or simply
yarn start
```
#### Running with docker
```
docker run --rm -p 3000:3000 --name=pdf-generator quay.io/isneezy/pdf-generator-service
```
Check our [docker repository](https://quay.io/repository/isneezy/pdf-generator-service?tab=tags) for available tags

## API
The webserver started by express.js has one JSON endpoint to generate PDFs.

#### POST `/generate`
Will generate a PDF based on the given `payload` data and returns the pdf file as a stream
```json5
{
  "goto": "", // optional - URL to the HTML content/handlebars template to be converted to PDF. This option overrides the content when present.
  "content": "", // required when goto is not present - HTML string/handlebars template to be converted to PDF,
  "context": {}, // object with the data to be passed to handlebars template engine
 "orientation": "portrait", // optional - possible values ["portrait", "landscape"]
 "format": "A4", // optional - possible values  ["Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"]
 "header": "", // optional - HTML template for the print header. See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagepdfoptions
 "footer": "" // optional - HTML template for the print footer. available context variables date: title, url, pageNumber, totalPages and pageNumber. Note these variables should be used with 3 mustaches ex: {{{ pageNumber }}}
}
```

##### Example
```json5
{
 "content": "<h2>Hello from Express PDF Generator Service</h2><p>Writen by {{ author }}</p>",
 "context": { "author": "Ivan Vilanculo <mail@example.com>" },
 "orientation": "portrait",
 "format": "A5",
 "footer": "<p>{{ name }} &copy; {{{ date }}}, page {{{ pageNumber }}} of {{{ totalPages }}}</p>"
}
```

### Generating table of contents (TOCs)
PDF Generator Service can generate TOCs for your document. All you have to do is simply add the template for your TOCs inside an element with `.print-toc` class.
  
**Note**:
1. This feature highly relies on semantic HTML, which means that all heading tags (h1, h2, h3, h4, h5, and h6) will be used to create your TOCs.
Add `toc-ignore` class to a heading tag if you want to ignore. 
2. TOCs will always appear or be rendered on the first pages of your document.
```handlebars
<html>
<body>
<div class="print-toc">
<h1>Table of contents</h1>
{{#each _toc}}
<a style="display: flex; margin-bottom: 6px; text-decoration: none; color: inherit" href="{{ this.href }}">
    <div>{{ this.title }}</div>
    <div style="margin: 0 4px; flex: 1; border-bottom: 2px dotted black"></div>
    <div>{{ this.page }}</div>
</a>
{{/each}}
</div>
<!-- place your document markup content here and all heading tags will be used to create TOCs -->
</body>
</html>
```

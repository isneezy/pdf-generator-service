# Express PDF Generator Service

[![example workflow name](https://github.com/isneezy/pdf-generator-service/workflows/CI/badge.svg?branch=master)](https://github.com/isneezy/pdf-generator-service)
[![example workflow name](https://github.com/isneezy/pdf-generator-service/workflows/Docker%20Image/badge.svg?branch=master)](https://github.com/isneezy/pdf-generator-service)


A simple express service that generates a pdf based on the submitted HTML using Chromium and Puppeteer

## Getting started
```bash
## build
yarn install
yarn build
## Running the server
node ./dist/src/index.js
## Or simply
yarn start
```

## API
The webserver started by express.js has one JSON endpoint to generate PDFs.

#### POST `/generate`
Will generate a PDF based on the given `payload` data and returns the pdf file as a stream
```js
{
 "content": "" // required - HTML string to be converted to PDF
 "orientation: "portrait" // optional - possible values ["portrait", "landscape"],
 "format": "A4" // optional - possible values  ["Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"]
}
```

##### Example
```json
{
 "content": "<h2>Express PDF Generator Service</h2>"
 "orientation: "landscape",
 "format": "A5"
}
```

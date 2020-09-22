# Express PDF Generator Service


[![Build](https://img.shields.io/github/workflow/status/isneezy/pdf-generator-service/CI/master)](https://github.com/isneezy/pdf-generator-service)
[![Docker Build](https://img.shields.io/docker/cloud/build/isneezy/pdf-generator)](https://hub.docker.com/r/isneezy/pdf-generator)
[![Coverage Status](https://coveralls.io/repos/github/isneezy/pdf-generator-service/badge.svg?branch=master)](https://coveralls.io/github/isneezy/pdf-generator-service?branch=master)


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
docker run --rm -p 3000:3000 --name=service isneezy/pdf-generator
```
Check our [docker hub repository](https://hub.docker.com/r/isneezy/pdf-generator) for available tags

## API
The webserver started by express.js has one JSON endpoint to generate PDFs.

#### POST `/generate`
Will generate a PDF based on the given `payload` data and returns the pdf file as a stream
```json5
{
 "content": "", // required - HTML string/handlebars template to be converted to PDF,
 "context": {}, // object with the data to be passed to handlebars template engine
 "orientation": "portrait", // optional - possible values ["portrait", "landscape"]
 "format": "A4" // optional - possible values  ["Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"]
 "header": "", // optional - HTML template for the print header. See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagepdfoptions
 "footer": "" // optional - HTML template for the print footer. See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagepdfoptions
}
```

##### Example
```json5
{
 "content": "<h2>Express PDF Generator Service</h2>",
 "orientation": "landscape",
 "format": "A5"
}
```

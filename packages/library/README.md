# `PDF Generator`

> A powerful and versatile library for converting HTML pages, templates, and URLs into high-quality PDF documents using Chromium and Puppeteer. 
> With `pdf-generator`, you can easily create PDFs with support for table of contents and various page configurations such as page size, borders, and more. The library is designed to be easy to use and integrate into your existing projects, making it the perfect solution for developers looking to add PDF functionality to their web applications. Whether you're looking to create professional-looking PDF reports, e-books, or other documents, `pdf-generator` has you covered. With its robust and customizable features, you'll be able to create exactly the PDF you need, every time.

## Installation

### yarn
```shell
yarn add @isneezy/pdf-generator
```

### npm
```shell
npm install @isneezy/pdf-generator
```

## Usage

```js
import PdfGenerator from '@isneezy/pdf-generator'

const template = '<p>Hello from {{ name }}</p>'
const context = { name: 'PDF Generator' }

const instance = PdfGenerator.instance()

instance
  .generate({ tempate, context })
  .then(instance.close)
```

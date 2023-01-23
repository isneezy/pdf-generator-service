# `@isneezy/pdf-generator`

`@isneezy/pdf-generator` is a powerful and versatile library that allows you to convert HTML pages, templates, and URLs
into high-quality PDF documents using Chromium and Puppeteer.

With @isneezy/pdf-generator, you can easily create PDFs with support for table of contents and various page
configurations such as page size, margins, and more. The library is designed to be easy to use and integrate into your
existing projects, making it the perfect solution for developers looking to add PDF functionality to their applications.

## Installation

To install the package, you can use npm or yarn.

```shell
npm install @isneezy/pdf-generator
```

```shell
yarn add @isneezy/pdf-generator
```

## Usage
The package exports a single class `PdfGenerator` that you can use to create a new instance of the library

```js
import PdfGenerator from '@isneezy/pdf-generator'

const instance = PdfGenerator.instance()
```

The class has the following methods:

### generate(options: Options): Promise&lt;Buffer&gt;
This method generates a PDF from the provided options and returns a promise that resolves
to a buffer with the PDF content.

The options object has the following shape:

| Option          | Type	   | Description                                                                                                                                |
|-----------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------|
| goto	           | string  | URL to the HTML content/handlebars template to be converted to PDF. If provided, it takes priority over the template option.               |
| template	       | string  | HTML content/Handlebars template to be converted to PDF. If a goto option is provided, this option will be ignored.                        |
| context         | object  | The data that will be passed to the handlebars template for rendering.                                                                     |
| headerTemplate	 | string  | Handlebars template to be rendered as the page header                                                                                      |
| footerTemplate  | string  | Handlebars template to be rendered as the page footer. If a footer template is provided in the document, this option will take priority.   |
| format          | string  | Sets the paper format to be used when printing a PDF. Accepted values include: letter, legal, tabloid, ledger, a0, a1, a2, a3, a4, a5, a6. |
| landscape       | boolean | If set to true, the PDF will be generated in landscape orientation, otherwise it will be generated in portrait orientation.                |
| margin          | object  | An object with the properties top, bottom, left, right which sets the page margins. The values should be strings with units, e.g. "10mm".  |


### close(): Promise&lt;void&gt;

This method releases the resources used by the instance of the `PdfGenerator` class, it should be called after using the generate method.

```js
instance.close()
```

## Example

Here is an example of how to use the library to generate a PDF from a handlebars template and context data:

```js
import { writeFileSync } from 'fs'
import PdfGenerator from '@isneezy/pdf-generator'

const template = '<p>Hello from {{ name }}</p>'
const context = { name: 'PDF Generator' }
// Creates a new instance of PdfGenerator
const instance = PdfGenerator.instance()

// generate the PDF file
instance.generate({ template, context })
  .then(buffer => {
// write the file to disk
    writeFileSync('path/to/the/output.pdf', buffer)
  })
  .finally(instance.close)
```

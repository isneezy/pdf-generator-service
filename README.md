# PDF Generator

A powerful and versatile tool for converting HTML pages, templates, and URLs into high-quality PDF documents using Chromium and Puppeteer.  
With `pdf-generator`, you can easily create PDFs with support for table of contents and various page configurations such as page size, margins, and more. The tool is designed to be easy to use and integrate into your existing projects, making it the perfect solution for developers looking to add PDF functionality to their applications. Whether you're looking to create professional-looking PDF reports, e-books, or other documents, `pdf-generator` has you covered. With its robust and customizable features, you'll be able to create exactly the PDF you need, every time.

## Features
- Convert HTML documents from a given URL
- Convert HTML documents passed as raw strings
- Support for handlebars templating
- Support for table of contents
- Support for document headers and footers
- Support for various standard paper formats
- Ability to generate documents in portrait or landscape orientation
- Support for custom page margins

## Installation
PDF Generator is composed of 3 different packages, each intended for a specific usage:
- [`@isneezy/pdf-generator`](packages/library/README.md) is a library that can be used in existing projects
- [`@isneezy/pdf-generator-cli`](packages/cli/README.md) is a command-line interface that can be used to generate PDFs from the command line
- [`@isneezy/pdf-generator-service`](packages/service/README.md) is a web service that allows for generating PDFs via HTTP requests

To install the library:
```shell
npm install yarn add @isneezy/pdf-generator
```

To install the command-line interface:
```shell
npm install yarn add @isneezy/pdf-generator-cli
```

To install the web service using npm:
```shell
npm install yarn add @isneezy/pdf-generator-cli
```

To install the web service using a container:
```shell
docker run -p 3000:3000 quay.io/isneezy/pdf-generator-service
```
This will run the web service on port 3000 and make it accessible on your localhost.

## Usage
For more detailed usage instructions and options for each package, refer to the package's documentation.

The library [`@isneezy/pdf-generator`](packages/library/README.md) can be used in existing projects and has the following method:
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
  // freeup memorey by releasing used resources
  .finally(instance.close)

```

The command-line interface [`@isneezy/pdf-generator-cli`](packages/library/README.md) has the following usage:
```shell
pdf-generator -t "path/to/template.html" -c "path/to/context.json" -o "path/to/output.pdf"
# Or you can pass the template and context directly
pdf-generator -t "<p>My {{ name }}</p>" -c '{ name: "template"}' -o "path/to/output.pdf"
```

The web service [`@isneezy/pdf-generator-service`](packages/service/README.md) can be deployed on your server, and it has the following usage:
```shell
pdf-generator-service -p 3000
# Or with docker
docker run -p 3000:3000 quay.io/isneezy/pdf-generator-service
```
This will run the web service on port 3000 and make it accessible on your localhost.
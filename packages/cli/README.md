# `pdf-generator-cli`

> A powerful command-line interface for converting HTML pages, templates, and URLs into high-quality PDF documents. With `@isneezy/pdf-generator-cli`, you can easily create PDFs with support for table of contents and various page configurations such as page size, margins, and more, all from the comfort of your command line.
>Whether you're looking to create professional-looking PDF reports, e-books, or other documents, this command line interface has you covered. With its robust and customizable features, you'll be able to create exactly the PDF you need, every time. It's also platform independent, it works on Windows, Linux and Mac.

## Usage

```
Usage: pdf-generator [options]

A powerful and versatile command line interface for converting HTML pages, templates, and URLs into high-quality PDF documents with support for table of content.

Options:
  -V, --version                           output the version number
  -g, --goto <url>                        URL to the HTML/handlebars template to be converted to PDF, if set this takes priority over --template option
  -t, --template <template>               path to HTML/handlebars template or string containing HTML/handlebars template to be converted to PDF
  -c, --context <context>                 path to json file or json or json string with the data to be passed to the HTML template
  -f, --format <format>                   sets paper format type to be used when printing a PDF (default: "A4")
  -H, --header-template <headerTemplate>  string containing the template to te header, if set this takes priority over the header template in the document
  -F, --footer-template <footerTemplate>  string containing the template to te footer, if set this takes priority over the footer template in the document
  -L, --landscape                         use this flag to switch the orientation from portrait to landscape (default: false)
  -M, --margin <margin>                   Set the page margins (default: "10mm")
  -o, --output <output>                   path to the output PDF file (default: "./generated.pdf")
  -h, --help                              display help for command
```

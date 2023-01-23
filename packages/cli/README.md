# @isneezy/pdf-generator-cli

`@isneezy/pdf-generator-cli` is a command line interface for the [`@isneezy/pdf-generator`](../library/README.md) library, it allows you to easily generate PDFs from the command line.

The package provides a single command `pdf-generator` that you can use to generate PDFs from a URL, HTML content or handlebars template with the context data.

# Installation
To install the package, you can use npm or yarn.

```shell
npm install -g @isneezy/pdf-generator-cli
```

```shell
yarn global add @isneezy/pdf-generator-cli
```

## Usage

The package provides a single command `pdf-generator` that you can use to generate PDFs.

```shell
pdf-generator [options]
```

| Option              | Type      | Default | Description                                                                                                                                                       |
|---------------------|-----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| -V, --version       |           |         | Output the version number                                                                                                                                         |
| -g, --goto          | `string`  |         | URL to the HTML content/handlebars template to be converted to PDF. If provided, it takes priority over the template option.                                      |
| -t, --template      | `string`  |         | Path to HTML/handlebars template or string containing HTML/handlebars template to be converted to PDF. If a goto option is provided, this option will be ignored. |
| -c, --context       | `string`  |         | Path to json file or json or json string with the data to be passed to the HTML template                                                                          |
| -f, --format        | `string`  | `A4`    | Sets the paper format to be used when printing a PDF. Accepted values include: letter, legal, tabloid, ledger, a0, a1, a2, a3, a4, a5, a6.                        |
| -H, --header-template | `string`  |         | String containing the template to the header, if set this takes priority over the header template in the document                                                 |
| -F, --footer-template | `string`  |         | String containing the template to the footer, if set this takes priority over the footer template in the document                                                 |
| -L, --landscape     | `boolean` | `false` | Use this flag to switch the orientation from portrait to landscape                                                                                                |
| -M, --margin | string | `10mm`  | Set the page margins. The margin option can be set in the following formats: <br/><ul><li>"margin" : sets the same margin for all four sides (top, bottom, left, right). Eg: <code>10mm</code></li><li>"top-bottom,left-right" : sets the same margin for top and bottom, and the same margin for left and right. Eg: <code>10mm,5mm</code></li><li>"top,bottom,left,right" : sets different margins for each side. Eg: <code>3mm,10mm,4mm,9mm</code></li></ul>
| -o, --output        | string    |         | Path to the output PDF file                                                                                                                                       |

The command takes the same options as the
[`generate`](../library/README.md#generate--options--options---promiseltbuffergt) method in the
[`@isneezy/pdf-generator`](../library/README.md) library, and it generates the PDF file in the specified `output` path.

Here is an example of how to use the command to generate a PDF from a handlebars template and context data:
```shell
pdf-generator -t "path/to/template.html" -c "path/to/context.json" -o "path/to/output.pdf"
# Or you can pass the template and context strings directly
pdf-generator -t "<p>My {{ name }}</p>" -c '{ name: "template"}' -o "path/to/output.pdf"
```

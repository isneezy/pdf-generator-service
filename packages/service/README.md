# @isneezy/pdf-generator-service

[![Build Status](https://img.shields.io/github/actions/workflow/status/isneezy/pdf-generator-service/ci.yml?branch=next&logo=github)](https://github.com/isneezy/pdf-generator-service/tree/next)
[![Coverage Status](https://coveralls.io/repos/github/isneezy/pdf-generator-service/badge.svg?branch=next)](https://coveralls.io/github/isneezy/pdf-generator-service?branch=next)
![npm (tag)](https://img.shields.io/npm/v/@isneezy/pdf-generator/next?logo=npm)

`@isneezy/pdf-generator-service` is a web service that allows you to easily generate PDFs from a web interface.
It uses the [@isneezy/pdf-generator](../service/README.md) library to generate the PDFs and provides an HTTP API that
you can use to generate PDFs from a web application.

The package is available in three forms:

- as a command line interface
- as a container image

# Installation
## Command Line Interface
You can install the package as a command line interface using npm or yarn.

```shell
npm install -g @isneezy/pdf-generator-service
```

```shell
yarn global add @isneezy/pdf-generator-service
```

## Container Image

The package is also available as a container image on 
[quay.io](https://quay.io/repository/isneezy/pdf-generator-service).
It's suggested to check the [available tags here](https://quay.io/repository/isneezy/pdf-generator-service?tab=tags)
before pulling the image.

To run the service in a container, you can use the docker run command and specify the necessary environment variables
and ports.

For example:

```shell
docker run -p 3000:3000 quay.io/isneezy/pdf-generator-service
```

This command will start the service and make it accessible on port 3000.

## Usage
### Command Line Interface

To start the service, you can use the pdf-generator-service command.

```shell
pdf-generator-service [options]
```

| Option          | Type      | Default | Description                                             |
|-----------------|-----------|---------|---------------------------------------------------------|
| -V, --version   |           |         | Output the version number                               |
| -p, --port      | `number`  | `3000`  | Specify the port in which the service will be listening |
| -c, --cors      | `boolean` | `false` | Enable CORS (Cross-Origin Resource Sharing)             |
| -l, --log-level | `string`  | `info`  | Specify the log level (info, warn, error, silent)       |

It's important to note that when using the container image, the options should be passed as environment variables.

## HTTP API

The service exposes a single endpoint: POST `/v1/generate.`

You can use this endpoint to generate a PDF by making a POST request with the following options as the request body.

| Option         | Type       | Default                                                                | 	Description                                                                                                         |
|----------------|------------|------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| goto           | 	`string`  |                                                                        | 	URL to the HTML content/handlebars template to be converted to PDF. If set this takes priority over template option |
| template       | 	`string`  |                                                                        | 	Handlebars template to be converted to PDF                                                                          |
| headerTemplate | 	`string`  |                                                                        | 	Handlebars template to be rendered as page header                                                                   |
| footerTemplate | 	`string`  |                                                                        | 	Handlebars template to be rendered as page footer                                                                   |
| context        | 	`object`  | `{}`                                                                   | 	Data to be passed to the HTML template                                                                              |
| format	        | string     | `A4`                                                                   | 	Sets paper format type to be used when printing a PDF (default: "A4")                                               |
| landscape      | 	`boolean` | `false`                                                                | 	Use this flag to switch the orientation from portrait to landscape (default: false)                                 |
| margin         | 	`object`  | <code>{top: "10mm", bottom: "10mm", left: "10mm", right: "10mm"}<code> | 	Set the page margins (default: "10mm")                                                                              |

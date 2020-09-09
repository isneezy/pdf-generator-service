import fs from 'fs'
import mkdirp from "mkdirp"
import express from 'express'
import bodyParser from "body-parser"
import puppeteer from 'puppeteer'
import uid from 'uid-safe'
import {validatePayload} from "./payloadValidator";
const temporaryDir = `${__dirname}/tmp/`
const version = process.env.npm_package_version;
const port = process.env.APP_PORT || 3000

// make sure temporary dir is available
mkdirp.sync(temporaryDir)

const app = express();

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({
    'tag': 'PDF Generator',
    version
  });
})

app.post('/generate', async (req, res) => {
  if (req.header('Content-Type') !== 'application/json') {
    res.status(400).json({
      message: 'We only support json format'
    })
    return
  }
  const errors = validatePayload(req.body);

  if (Object.keys(errors).length) {
    res.status(400).json({
      message: 'Unprocessable request',
      errors
    })
    return
  }

  let browser
  try {
    const htmlFilePath = `${__dirname}/tmp/${uid.sync(18)}.html`
    const pdfFilePath = `${__dirname}/tmp/${uid.sync(18)}.pdf`

    fs.writeFileSync(htmlFilePath, req.body.html, { encoding: "utf-8"})

    browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`file://${htmlFilePath}`, {waitUntil: 'networkidle2'})
    await page.pdf({path: pdfFilePath, format: 'A4'})
    await browser.close()
    res.on('finish', async () => {
      fs.unlinkSync(htmlFilePath)
      fs.unlinkSync(pdfFilePath)
    })
    res.setHeader('Content-Type', 'application/pdf')
    fs.createReadStream(pdfFilePath).pipe(res)
  } catch (e) {
    await browser?.close()
    console.warn(`⚠️ [server]: ${e.message}`, e)
    res.status(500).json({
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : e.message
    })
  }
});

const server = app.listen(port, () => {
  console.log(`⚡️[server]: PDF Generator v${version} is running at http://localhost:${port}`)
});

export { app, server }

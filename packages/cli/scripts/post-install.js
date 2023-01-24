/* eslint-disable @typescript-eslint/no-var-requires */
const { existsSync, readFileSync, writeFileSync } = require('fs')
const path = require('path')

const SHEBANG = '#!/usr/bin/env node'
const binFile = path.resolve(__dirname, '../dist/src/index.js')

if (existsSync(binFile)) {
  const content = readFileSync(binFile, 'utf-8').trim()
  if (content.startsWith(SHEBANG)) return
  writeFileSync(binFile, `${SHEBANG}\n\n${content}`)
}

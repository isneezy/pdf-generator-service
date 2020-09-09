import express from 'express'
const version = process.env.npm_package_version;
const app = express();
const port = process.env.APP_PORT || 3000

app.get('/', (req, res) => {
  res.json({
    'tag': 'PDF Generator',
    version
  });
})

app.listen(port, () => {
  console.log(`⚡️[server]: PDF Generator v${version} is running at http://localhost:${port}`)
});

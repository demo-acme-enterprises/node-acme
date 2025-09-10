const express = require('express')
const app = express()
const port = 3000

const SECRET_TOKEN = 'abc12e2o3cenodsnlknewd';

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

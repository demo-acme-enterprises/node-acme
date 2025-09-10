const express = require('express')
const app = express()
const port = 3000

const SECRET_API_TOKEN = 'abc1234skdhusdgf9732bwcf';

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

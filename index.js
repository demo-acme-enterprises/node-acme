const express = require('express')
const app = express()
const port = 3000

const SECRET_API_TOKEN = 'abc1234skdhusdgf973sdfsdf2bwcf';

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

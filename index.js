const express = require('express')
const app = express()
const port = 3000

const auth = (un, pw) => { return true }
const createToken = (un) => { return 'abc123' }
const createTracker = (un) => { return 'cookie-abc123' }

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!auth(username, password)) {
        res.status(400).send("Incorrect credentials");
        return;
    }
   
    res.redirect('/')
})

app.get('/', (req, res) => {
    console.log('Homepage!')
    res.end()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

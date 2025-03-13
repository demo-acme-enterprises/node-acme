const express = require('express')
const helmet = require('helmet')
const session = require('express-session')
const csurf = require('csurf')
const app = express()
app.use(helmet())
const port = 3000

const auth = (un, pw) => { return true }
const createToken = (un) => { return 'abc123' }

app.use(csurf())
app.use(session({
  secret: 'keyboard cat',
  name: 'my-session',
  cookie: { path: '/', secure: true }
}))

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Test auth
    if (!auth(username, password)) {
        res.status(400).send("Incorrect credentials");
        return;
    }

    // Set the session cookie
    res.cookie('auth', createToken(username), {
        domain: '.acme.corp',
        path: '/',
        expires: new Date(Date.now() + 60 * 60 * 1000),
        httpOnly: true
    });
   
    res.redirect('/feed')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

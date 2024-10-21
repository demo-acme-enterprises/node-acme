const express = require('express')
const app = express()
const port = 2000

const auth = (un, pw) => { return true }
const createToken = (un) => { return 'abc123' }
const createTracker = (un) => { return 'cookie-abc123' }

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!auth(username, password)) {
        res.status(400).send("Incorrect credentials");
        return;
    }

    // Set the session cookie
    res.cookie('auth', createToken(username), {
        domain: '.social.corp',
        path: '/',
        expires: new Date(Date.now() + 60 * 60 * 1000)
    });

    // Set tracking cookie with unique identifier
    res.cookie('tracking', createTracker(username))
   
    res.redirect('/feed')
})


app.post('/update-cart', (req, res) => {
    res.cookie('my-cart', {
        items: req.body.cart?.items || [],
    })
    res.redirect('/cart')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

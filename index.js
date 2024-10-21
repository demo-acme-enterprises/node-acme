const express = require('express')
const app = express()
const port = 2000

const auth = (un, pw) => { return true }
const createToken = (un) => { return 'abc123' }
const createCart = (items) => { return 'cart-cookie-abc123' }

app.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    if (!auth(username, password)) {
        res.status(400).send("Incorrect credentials");
        return;
    }

    res.cookie('auth', createToken(username), {
        domain: '.acme.corp',
        path: '/',
        httponly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000)
    });
    next()
}

app.post('/update-cart', (req, res, next) => {
  const { items } = req.body
  res.cookie('cart-contents', { secure: true }, createCart(items))
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { createHash } = require('crypto');

const { lookupUserLogin } = require('./lib/db');

const port = 3000;

const app = express();
app.use(helmet());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'keyboard cat',
  cookie: {}
}));

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  let { username, password } = req.body;
  const md5Hash = createHash('md5').update(password).digest('hex');
  lookupUserLogin(username, md5Hash).then(validLogin => {
    if (validLogin) {
      req.session.authenticated = true;
      res.redirect('/');
    } else {
      res.render('login', { error: 'Invalid credentials.' });
    }
  })
});

function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }
  res.redirect('/login');
}

app.get('/', isAuthenticated, (req, res) => {
  res.render('welcome');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
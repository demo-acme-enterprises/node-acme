const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { createHash } = require('crypto');
const { lookupUserLogin } = require('./lib/db');

const app = express();
app.use(helmet());

const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const secretKey = 'abc 1234';
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false
}));

// Login route added
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
  }).catch(err => {
    res.render('login', { error: 'An error occurred. Please try again.' });
  });
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
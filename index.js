const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const csrf = require('csurf');
const path = require('path');

const { lookupUserLogin } = require('./lib/db');

const port = 3000;

const app = express();
app.use(helmet());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'keyboard cat',
  cookie: { secure: true }
}));
app.use(csrf());

const { rateLimit } = require('express-rate-limit');
const loginRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  limit: 5, // Limit each IP to 5 requests per windowMs
});
app.get('/login', loginRateLimiter, (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  let { username, password } = req.body;
  lookupUserLogin(username, password).then(validLogin => {
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
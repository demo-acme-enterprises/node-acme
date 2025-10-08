const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const csurf = require('csurf');
const path = require('path');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const app = express();
app.use(helmet());
const port = 3000;

const SECRET_TOKEN = process.env.SECRET_TOKEN;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
});
app.use(limiter);
app.use(session({
  secret: SECRET_TOKEN,
  resave: false,
  saveUninitialized: false
}));
app.use(csurf({ cookie: true }));

// Login route
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  let { username, password } = req.body;
  // Validate and sanitize input
  username = typeof username === 'string' ? validator.escape(username).slice(0, 32) : '';
  password = typeof password === 'string' ? validator.escape(password).slice(0, 32) : '';
  if (username === 'admin' && password === 'password') {
    req.session.authenticated = true;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid credentials.' });
  }
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
  console.log(`Example app listening on port ${port}`);
});

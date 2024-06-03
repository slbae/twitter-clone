const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 80;

// Set up Middleware
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());
const sessionCookieMiddleware = require('./src/sessionCookieMiddleware');
app.use(sessionCookieMiddleware);

const routes = require('./src/router.js');
const html_dir = __dirname + '/templates/';
app.use('/', routes);

// Routes

app.get('/', (req, res) => {
  res.sendFile(`${html_dir}login.html`);
});

app.get('/profile', (req, res) => {
    res.sendFile(`${html_dir}profile.html`);
});

app.get('/main', (req, res) => {
    res.sendFile(`${html_dir}main.html`);
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));


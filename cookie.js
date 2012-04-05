
var express = require('express');

var cookie_session = require('./middleware/cookie_session');

var log = require('logger').default({ git: false });

// make the app
var app = express.createServer();

app.use(express.cookieParser());

app.use(cookie_session({
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    },
    key: 'example.sess',
    secret: 'my precious',
}));

// runs for anything under /user
app.get('/', function(req, res, next) {
    res.json(req.headers);
});

app.listen(process.env.PORT || 8000, '0.0.0.0');


var express = require('express');
var hbs = require('hbs');

var log = require('logger').default({ git: false });

var NotFound = require('./error').NotFound;
var BadRequest = require('./error').BadRequest;
var Forbidden = require('./error').Forbidden;

// to print or not to print?
var kProduction = false;

// make the app
var app = express.createServer();

app.register('html', hbs);

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('view options', {
    layout: false,
});

app.use(express.cookieParser());
app.use(express.session({ secret: 'cat' }));

app.use(express.bodyParser());

app.use(function(req, res, next) {
    res.local('error', req.session.error);
    delete req.session.error;

    next();
});

// make sure to process all the routes first
app.use(app.router);

app.get('/', function(req, res, next) {
    res.render('basic_form');
});

app.post('/login', function(req, res, next) {
    var username = req.param('username');

    if (!username) {
        return next(new BadRequest('username must be specified'));
    }

    if (username !== 'zombie') {
        return next(new BadRequest('invalid username'));
    }

    // set some session stuffs
    req.session.user = 'zombie';

    return res.redirect('/welcome');
});

app.get('/welcome', function(req, res, next) {
    if (!req.session || !req.session.user) {
        return next(new Forbidden());
    }

    res.send('hi');
});

// error handler is last middleware (doesn't have to be)
// make sure to use 4 arguments
// this is how express detects this is an error handler
app.use(function(err, req, res, next) {
    var status = err.status || 500;

    // switch on status, could do instance of checks
    switch (status) {
    case 400:
        req.session.error = err.message;
        return res.redirect(req.headers.referer);
    case 404:
        return res.send('not found!', status);
    default:
        return res.send(err.message || 'forbidden', status);
    }

    // if req.accepts('json') or html
    // can also choose to render pretty pages

    // you can capture the url from req.url
    // this is useful for tracking down certain errors
    log.error(err, { url: req.url });

    if (!kProduction) {
        return res.send(err.stack);
    }

    return res.send(status);
});

app.listen(process.env.PORT || 8000, '0.0.0.0');

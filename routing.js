
var express = require('express');

var NotFound = require('./error').NotFound;
var log = require('logger').default({ git: false });

// make the app
var app = express.createServer();

// any amount of middleware to process before the requests
// generally cookie, body, session, etc

// something custom
app.use(function(req, res, next) {
    next();
});

// runs for anything under /user
app.use('/user', function(req, res, next) {
    req.user = 'some user here';

    next();
});

app.param('post_id', function(req, res, next, id) {
    switch (id) {
    case '1':
        req.post = 'my first post';
        break;
    case '2':
        req.post = 'my second post';
        break;
    default:
        return next(new NotFound());
    }

    next();
});

// make sure to process all the routes first
app.use(app.router);

// middleware after requests
// only hit if request did not consume
// generally error handlers
// error handler is last middleware (doesn't have to be)
// make sure to use 4 arguments
// this is how express detects this is an error handler
app.use(function(err, req, res, next) {
    var status = err.status || 500;

    // switch on status, could do instance of checks
    switch (status) {
    case 400:
        return res.send(err.message, status);
    case 404:
        return res.send('not found!', status);
    }

    // if req.accepts('json') or html
    // can also choose to render pretty pages

    // you can capture the url from req.url
    // this is useful for tracking down certain errors
    log.error(err, { url: req.url });

    return res.send(err.stack);
});

// if you don't use app.router
// it will be installed after the first call to .get/post, etc

app.get('/', function(req, res, next) {
    res.send('hello world');
});

app.get('/user', function(req, res, next) {
    res.send('user: ' + req.user);
});

app.get('/user/account', function(req, res, next) {
    res.send('user: ' + req.user);
});

app.get('/posts/:post_id', function(req, res, next) {
    res.send(req.post);
});

app.listen(process.env.PORT || 8000, '0.0.0.0');

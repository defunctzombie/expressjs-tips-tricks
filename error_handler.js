
var express = require('express');

var log = require('logger').default({ git: false });

var NotFound = require('./error').NotFound;
var BadRequest = require('./error').BadRequest;

// to print or not to print?
var kProduction = false;

// make the app
var app = express.createServer();

// make sure to process all the routes first
app.use(app.router);

app.get('/', function(req, res, next) {
    res.send('hello world');
});

app.get('/user/:id', function(req, res, next) {
    next(new BadRequest('invalid id'));
});

app.get('/404', function(req, res, next) {
    next(new NotFound());
});

app.get('/500', function(req, res, next) {
    next(new Error('regular error'));
});

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

    if (!kProduction) {
        return res.send(err.stack);
    }

    return res.send(status);
});

app.listen(process.env.PORT || 8000, '0.0.0.0');

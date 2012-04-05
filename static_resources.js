
var express = require('express');
var hbs = require('hbs');

var log = require('logger').default({ git: false });

// allows us to easily request a fingerprint for a resource
hbs.registerHelper('fingerprint', function(value) {
    log.trace(value);

    // your choice of how to fingerprint
    // md5, timestamps, etc
    var hash = '548a05af48ef6545db2fd999b12ca937';

    return '/static/' + hash + value;
});

// make the app
var app = express.createServer();

app.register('html', hbs);

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('view options', {
    layout: false,
});

app.use(function(req, res, next) {
    // not a static route, skip
    if (!req.url.match(/\/static\/[a-f0-9]{32}\/(.*)/)) {
        return next();
    }

    // this will allow the static handler to handle the url
    // because it will be able to find it now
    req.url = '/' + RegExp.$1;

    // we could have our own static asset server here

    next();
});

app.use(express.static(__dirname + '/static', { maxAge: 86400000 }));

// runs for anything under /user
app.get('/', function(req, res, next) {
    res.render('fingerprint');
});

app.listen(process.env.PORT || 8000, '0.0.0.0');

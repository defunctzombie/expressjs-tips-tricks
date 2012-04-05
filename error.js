var util = require('util');

function NotFound(msg) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'NotFound';
    this.status = 404;
    this.message = msg;
}

util.inherits(NotFound, Error);

function BadRequest(msg) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'BadRequest';
    this.status = 400;
    this.message = msg;
}

util.inherits(BadRequest, Error);

function Forbidden(msg) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'Forbidden';
    this.status = 403;
    this.message = msg;
}

util.inherits(Forbidden, Error);

module.exports.NotFound = NotFound;
module.exports.BadRequest = BadRequest;
module.exports.Forbidden = Forbidden;

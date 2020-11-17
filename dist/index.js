'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _router = require('./router/');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _router2.default();
var port = _config2.default.server.port;

var server = _http2.default.createServer(app.express);

server.listen(process.env.PORT || port);
server.on('error', function () {
    console.log('Port ' + (process.env.PORT || port) + ' is already in use.');
});
server.on('listening', function () {
    console.log('Server is listening on port ' + (process.env.PORT || port) + '.');
});
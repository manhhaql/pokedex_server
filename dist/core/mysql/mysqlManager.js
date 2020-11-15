'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MysqlManager = function MysqlManager() {
    _classCallCheck(this, MysqlManager);
};

;

MysqlManager.pool = _mysql2.default.createPool(process.env.CLEARDB_DATABASE_URL || {
    host: _config2.default.mysql.host,
    port: _config2.default.mysql.port,
    user: _config2.default.mysql.user,
    password: _config2.default.mysql.password,
    database: _config2.default.mysql.database,
    connectionLimit: _config2.default.mysql.connectionLimit
});

exports.default = MysqlManager;
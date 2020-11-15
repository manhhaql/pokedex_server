'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mysqlManager = require('./mysql/mysqlManager');

var _mysqlManager2 = _interopRequireDefault(_mysqlManager);

var _errorParser = require('../helper/errorParser');

var _errorParser2 = _interopRequireDefault(_errorParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthenticationCore = function () {
    function AuthenticationCore() {
        _classCallCheck(this, AuthenticationCore);

        this.createSession = this.createSession.bind(this);
    }

    _createClass(AuthenticationCore, [{
        key: 'createSession',
        value: function createSession(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    }

                    var query = 'INSERT INTO authentication_session SET ?';
                    var sessionData = {
                        user_id: options.user_id,
                        token: options.token
                    };
                    connection.query(query, sessionData, function (error, results, fields) {
                        connection.destroy();
                        if (error) {
                            return reject(_errorParser2.default.handleMysqlError(error));
                        }
                        resolve(results);
                    });
                });
            });
        }
    }, {
        key: 'updateSessionStatus',
        value: function updateSessionStatus(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    }

                    var whereData = [];
                    var query = 'UPDATE authentication_session set status = 1';
                    if (options.token !== undefined) {
                        whereData.push(options.token);
                    }
                    if (whereData.length) {
                        query += ' WHERE id > 0 AND';
                        var includeAnd = false;
                        if (options.token !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' token = ?';
                            includeAnd = true;
                        }
                    }

                    connection.query(query, whereData, function (error, result, fields) {
                        connection.destroy();
                        if (error) {
                            return reject(_errorParser2.default.handleMysqlError(error));
                        }
                        resolve(result);
                    });
                });
            });
        }
    }]);

    return AuthenticationCore;
}();

;

exports.default = AuthenticationCore;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errorParser = require('../helper/errorParser');

var _errorParser2 = _interopRequireDefault(_errorParser);

var _mysqlManager = require('./mysql/mysqlManager');

var _mysqlManager2 = _interopRequireDefault(_mysqlManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PropertiesCore = function () {
    function PropertiesCore() {
        _classCallCheck(this, PropertiesCore);

        this.getWeakness = this.getWeakness.bind(this);
        this.getType = this.getType.bind(this);
        this.getAbility = this.getAbility.bind(this);
    }

    _createClass(PropertiesCore, [{
        key: 'getType',
        value: function getType(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    };

                    var whereData = [];
                    if (options.id !== undefined) {
                        whereData.push(options.id);
                    };

                    var query = 'SELECT id, name FROM types';

                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' id = ?', includeAnd = true;
                        };
                    };

                    connection.query(query, whereData.concat([]), function (error, result, fields) {
                        connection.destroy();
                        if (error) {
                            return reject(_errorParser2.default.handleMysqlError(error));
                        }
                        resolve(result);
                    });
                });
            });
        }
    }, {
        key: 'getWeakness',
        value: function getWeakness(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    };

                    var whereData = [];
                    if (options.id !== undefined) {
                        whereData.push(options.id);
                    };

                    var query = 'SELECT id, name FROM weakness';

                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' id = ?', includeAnd = true;
                        };
                    };

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
    }, {
        key: 'getAbility',
        value: function getAbility(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    };

                    var whereData = [];
                    if (options.id !== undefined) {
                        whereData.push(options.id);
                    };

                    var query = 'SELECT id, name, description FROM ability';

                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' id = ?', includeAnd = true;
                        };
                    };

                    connection.query(query, whereData.concat([]), function (error, result, fields) {
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

    return PropertiesCore;
}();

;

exports.default = PropertiesCore;
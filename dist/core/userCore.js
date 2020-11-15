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

var UserCore = function () {
    function UserCore() {
        _classCallCheck(this, UserCore);

        this.get = this.get.bind(this);
        this.getBy = this.getBy.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
    }

    _createClass(UserCore, [{
        key: 'getBy',
        value: function getBy(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    };

                    var whereData = [];
                    if (options.username !== undefined) {
                        whereData.push(options.username);
                    };
                    if (options.id !== undefined) {
                        whereData.push(options.id);
                    };

                    var query = 'SELECT id, username, password, salt, type, status, created_at, updated_at FROM users';

                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.username !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' username = ?', includeAnd = true;
                        };
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
        key: 'get',
        value: function get(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    };

                    var whereData = [];
                    if (options.username !== undefined) {
                        whereData.push(options.username);
                    };
                    if (options.id !== undefined) {
                        whereData.push(options.id);
                    };
                    if (options.type !== undefined) {
                        whereData.push(options.type);
                    };
                    if (options.status !== undefined) {
                        whereData.push(options.status);
                    };

                    var query = 'SELECT id, username, email, avatar, type, status, created_at, updated_at FROM users';

                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.username !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' username like "%"?"%"', includeAnd = true;
                        };
                        if (options.id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' id = ?', includeAnd = true;
                        };
                        if (options.type !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' type = ?', includeAnd = true;
                        };
                        if (options.status !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' status = ?', includeAnd = true;
                        };
                    };
                    if (options.limit !== undefined && options.page !== undefined) {
                        query += ' LIMIT ? OFFSET ?';
                    }
                    connection.query(query, whereData.concat(options.limit !== undefined && options.page !== undefined ? [options.limit, (options.page - 1) * options.limit] : []), function (error, result, fields) {
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
        key: 'countTotal',
        value: function countTotal(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    }
                    var query = 'SELECT COUNT(id) AS total FROM users';

                    connection.query(query, options, function (error, result, fields) {
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
        key: 'create',
        value: function create(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    }
                    connection.query('INSERT INTO users SET ?', options, function (error, result, fields) {
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
        key: 'update',
        value: function update(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    }

                    var whereData = [];
                    if (options.id !== undefined) {
                        whereData.push(options.id);
                    };

                    var query = 'UPDATE users SET ?';

                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' id = ?', includeAnd = true;
                        };
                    };
                    connection.query(query, [options.values].concat(whereData), function (error, result, fields) {
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

    return UserCore;
}();

;

exports.default = UserCore;
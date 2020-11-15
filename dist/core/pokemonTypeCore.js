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

var PokemonTypeCore = function () {
    function PokemonTypeCore() {
        _classCallCheck(this, PokemonTypeCore);

        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.delete = this.delete.bind(this);
    }

    _createClass(PokemonTypeCore, [{
        key: 'get',
        value: function get(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    }
                    var whereData = [];
                    if (options.pokemon_id !== undefined) {
                        whereData.push(options.pokemon_id);
                    }
                    if (options.type_id !== undefined) {
                        whereData.push(options.type_id);
                    }
                    var query = 'SELECT pokemon_type.id, pokemon_type.pokemon_id, types.id as type_id, types.name as type_name, pokemon_type.created_at, pokemon_type.updated_at FROM pokemon_type';
                    query += ' LEFT JOIN types on pokemon_type.type_id = types.id';
                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.pokemon_id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon_type.pokemon_id = ?';
                            includeAnd = true;
                        }
                        if (options.type_id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon_type.type_id = ?';
                            includeAnd = true;
                        }
                    }
                    if (options.limit !== undefined && options.page !== undefined) {
                        query += ' LIMIT ? OFFSET ?';
                    }
                    connection.query(query, whereData.concat(options.limit !== undefined && options.page !== undefined ? [options.limit, (options.page - 1) * options.limit] : []), function (error, result, fields) {
                        connection.destroy();
                        if (error) {
                            return reject(_errorParser2.default.handleMysqlError(error));
                        }
                        resolve(Array.from(result));
                    });
                });
            });
        }
    }, {
        key: 'set',
        value: function set(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    };

                    var query = 'INSERT INTO pokemon_type SET ?';

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
        key: 'delete',
        value: function _delete(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    }

                    var whereData = [];
                    var query = 'DELETE FROM pokemon_type';
                    if (options.pokemon_id !== undefined) {
                        whereData.push(options.pokemon_id);
                    }
                    if (options.type_id !== undefined) {
                        whereData.push(options.type_id);
                    }
                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.pokemon_id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon_id = ?';
                            includeAnd = true;
                        }
                        if (options.type_id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' type_id = ?';
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

    return PokemonTypeCore;
}();

;

exports.default = PokemonTypeCore;
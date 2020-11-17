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

var PokemonAbilityCore = function () {
    function PokemonAbilityCore() {
        _classCallCheck(this, PokemonAbilityCore);

        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.delete = this.delete.bind(this);
    }

    _createClass(PokemonAbilityCore, [{
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
                    if (options.ability_id !== undefined) {
                        whereData.push(options.ability_id);
                    }
                    var query = 'SELECT pokemon_ability.id, pokemon_ability.pokemon_id, ability.id as ability_id, ability.name as ability_name, ability.description as ability_description, pokemon_ability.created_at, pokemon_ability.updated_at FROM pokemon_ability';
                    query += ' LEFT JOIN ability on pokemon_ability.ability_id = ability.id';
                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.pokemon_id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon_ability.pokemon_id = ?';
                            includeAnd = true;
                        }
                        if (options.ability_id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon_ability.ability_id = ?';
                            includeAnd = true;
                        }
                    }

                    connection.query(query, whereData, function (error, result, fields) {
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

                    var query = 'INSERT INTO pokemon_ability SET ?';

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
                    var query = 'DELETE FROM pokemon_ability';
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
                            query += (includeAnd ? ' AND' : '') + ' ability_id = ?';
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

    return PokemonAbilityCore;
}();

;

exports.default = PokemonAbilityCore;
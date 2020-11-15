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

var PokemonCore = function () {
    function PokemonCore() {
        _classCallCheck(this, PokemonCore);

        this.get = this.get.bind(this);
        this.getByName = this.getByName.bind(this);
        this.getLastId = this.getLastId.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
    }

    _createClass(PokemonCore, [{
        key: 'get',
        value: function get(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    }
                    var whereData = [];
                    if (options.id !== undefined) {
                        whereData.push(options.id);
                    }
                    if (options.name !== undefined) {
                        whereData.push(options.name);
                    }
                    if (options.tag !== undefined) {
                        whereData.push(options.tag);
                    }
                    if (options.type_id !== undefined) {
                        whereData.push(options.type_id);
                    }
                    if (options.weakness_id !== undefined) {
                        whereData.push(options.weakness_id);
                    }
                    if (options.ability_id !== undefined) {
                        whereData.push(options.ability_id);
                    }
                    var query = 'SELECT pokemon.id,\n                                    pokemon.name, \n                                    pokemon.tag, \n                                    pokemon.stage, \n                                    pokemon.of_basic, \n                                    pokemon.height, \n                                    pokemon.weight, \n                                    pokemon.gender, \n                                    pokemon.status, \n                                    (SELECT JSON_ARRAYAGG(pokemon_type.type_id) \n                                        FROM pokemon_type \n                                        WHERE pokemon_type.pokemon_id = pokemon.id\n                                        GROUP BY pokemon_type.pokemon_id) as types,\n                                    (SELECT JSON_ARRAYAGG(pokemon_weakness.weakness_id) \n                                        FROM pokemon_weakness \n                                        WHERE pokemon_weakness.pokemon_id = pokemon.id \n                                        GROUP BY pokemon_weakness.pokemon_id) as weakness,\n                                    (SELECT JSON_ARRAYAGG(pokemon_ability.ability_id) \n                                        FROM pokemon_ability \n                                        WHERE pokemon_ability.pokemon_id = pokemon.id \n                                        GROUP BY pokemon_ability.pokemon_id) as ability,\n                                    (SELECT pokemon_image.url\n                                        FROM pokemon_image\n                                        WHERE pokemon_image.pokemon_id = pokemon.id \n                                        GROUP BY pokemon_image.pokemon_id) as image,\n                                    pokemon.created_at, \n                                    pokemon.updated_at\n                            FROM pokemon';
                    query += ' LEFT JOIN pokemon_type on pokemon.id = pokemon_type.pokemon_id\n                                    LEFT JOIN pokemon_weakness on pokemon.id = pokemon_weakness.pokemon_id\n                                    LEFT JOIN pokemon_ability on pokemon.id = pokemon_ability.pokemon_id';

                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon.id = ?';
                            includeAnd = true;
                        }
                        if (options.name !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon.name like "%"?"%"';
                            includeAnd = true;
                        }
                        if (options.tag !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon.tag = ?';
                            includeAnd = true;
                        }
                        if (options.type_id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon_type.type_id = ?';
                            includeAnd = true;
                        }
                        if (options.weakness_id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon_weakness.weakness_id = ?';
                            includeAnd = true;
                        }
                        if (options.ability_id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon_ability.ability_id = ?';
                            includeAnd = true;
                        }
                    }

                    query += ' GROUP BY pokemon.id';
                    if (options.descending_by_id) {
                        query += " ORDER BY pokemon.id DESC";
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
        key: 'getByName',
        value: function getByName(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    }
                    var whereData = [];
                    if (options.name !== undefined) {
                        whereData.push(options.name);
                    }
                    var query = 'SELECT id, name, tag, stage, of_basic, height, weight, gender, status, created_at, updated_at FROM pokemon';
                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.name !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' name = ?';
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
                    var query = 'SELECT COUNT(id) AS total FROM pokemon';

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
        key: 'getLastId',
        value: function getLastId() {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    }
                    var query = 'SELECT id FROM pokemon ORDER BY id DESC LIMIT 1;';

                    connection.query(query, function (error, result, fields) {
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
                    };

                    var query = 'INSERT INTO pokemon SET ?';

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
                    }

                    var query = 'UPDATE pokemon SET ?';

                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' id = ?';
                            includeAnd = true;
                        }
                    }

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

    return PokemonCore;
}();

;

exports.default = PokemonCore;
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

var ProductPropertiesCore = function () {
    function ProductPropertiesCore() {
        _classCallCheck(this, ProductPropertiesCore);

        this.get = this.get.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
    }

    _createClass(ProductPropertiesCore, [{
        key: 'get',
        value: function get(options) {
            return new Promise(function (resolve, reject) {
                _mysqlManager2.default.pool.getConnection(function (error, connection) {
                    if (error) {
                        return reject(_errorParser2.default.handleMysqlError(error));
                    }
                    var whereData = [];
                    if (options.sku_id !== undefined) {
                        whereData.push(options.sku_id);
                    }
                    if (options.product_id !== undefined) {
                        whereData.push(options.product_id);
                    }
                    if (options.type_id !== undefined) {
                        whereData.push(options.type_id);
                    }
                    if (options.size_id !== undefined) {
                        whereData.push(options.size_id);
                    }
                    if (options.color_id !== undefined) {
                        whereData.push(options.color_id);
                    }
                    if (options.code !== undefined) {
                        whereData.push(options.code);
                    }

                    var query = 'SELECT pokemon.id,\n                                    pokemon.name,\n                                    types.id as type_id,\n                                    types.name as type_name\n                            FROM pokemon';

                    query += ' LEFT JOIN pokemon_type on pokemon.id = pokemon_type.pokemon_id\n                            LEFT JOIN types on pokemon_type.type_id = types.id';
                    if (whereData.length) {
                        query += ' WHERE';
                        var includeAnd = false;
                        if (options.sku_id !== undefined) {
                            query += (includeAnd ? ' AND' : '') + ' pokemon.id = ?';
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

                    var query = 'INSERT INTO product_properties set ?';

                    connection.query(query, {
                        product_id: options.product_id,
                        type_id: options.type_id,
                        size_id: options.size_id,
                        color_id: options.color_id,
                        stock: options.stock,
                        price: options.price,
                        code: options.code
                    }, function (error, result, fields) {
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
                    var query = 'update product_properties set ?';
                    if (options.sku_id !== undefined) {
                        whereData.push(options.sku_id);
                    }
                    if (whereData.length) {
                        query += ' where';
                        var includeAnd = false;
                        if (options.sku_id !== undefined) {
                            query += (includeAnd ? ' and' : '') + ' sku_id = ?';
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

    return ProductPropertiesCore;
}();

;

exports.default = ProductPropertiesCore;
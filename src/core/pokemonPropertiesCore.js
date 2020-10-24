import ErrorParser from '../helper/errorParser';
import MysqlManager from './mysql/mysqlManager';

class ProductPropertiesCore {
    constructor() {
        this.get = this.get.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
    };

    get(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if (error) {
                    return reject(ErrorParser.handleMysqlError(error));
                }
                let whereData = [];
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

                let query = `SELECT pokemon.id,
                                    pokemon.name,
                                    types.id as type_id,
                                    types.name as type_name
                            FROM pokemon`;

                query +=  ` LEFT JOIN pokemon_type on pokemon.id = pokemon_type.pokemon_id
                            LEFT JOIN types on pokemon_type.type_id = types.id`;
                if (whereData.length) {
                    query += ' WHERE';
                    let includeAnd = false;
                    if (options.sku_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon.id = ?`;
                        includeAnd = true;
                    }
                    if (options.type_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_type.type_id = ?`;
                        includeAnd = true;
                    }
                }

                if(options.limit !== undefined && options.page !== undefined) {
                    query += ' LIMIT ? OFFSET ?'
                }
                connection.query(
                    query,
                    whereData.concat(options.limit !== undefined && options.page !== undefined ? [options.limit, (options.page - 1) * options.limit] : []),
                    (error, result, fields)=>{
                        connection.destroy();
                        if(error) {
                            return reject(ErrorParser.handleMysqlError(error))
                        }
                        resolve(result);
                    }
                )
            });
        });
    };

    create(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if (error) {
                    return reject(ErrorParser.handleMysqlError(error))
                };

                let query = 'INSERT INTO product_properties set ?';

                connection.query(
                    query,
                    {
                        product_id: options.product_id,
                        type_id: options.type_id,
                        size_id: options.size_id,
                        color_id: options.color_id,
                        stock: options.stock,
                        price: options.price,
                        code: options.code,
                    },
                    (error, result, fields) => {
                        connection.destroy();
                        if (error) {
                            return reject(ErrorParser.handleMysqlError(error))
                        }
                        resolve(result);
                    }
                )
            })
        })
    };

    update(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection)=>{
                if(error) {
                    return reject(ErrorParser.handleMysqlError(error));
                }

                let whereData = [];
                let query = 'update product_properties set ?';
                if (options.sku_id !== undefined) {
                    whereData.push(options.sku_id);
                }
                if (whereData.length) {
                    query += ' where';
                    let includeAnd = false;
                    if (options.sku_id !== undefined) {
                        query += `${includeAnd ? ' and' : ''} sku_id = ?`;
                        includeAnd = true;
                    }
                }

                connection.query(
                    query,
                    [options.values].concat(whereData),
                    (error, result, fields) => {
                        connection.destroy();
                        if (error) {
                            return reject(ErrorParser.handleMysqlError(error));
                        }
                        resolve(result);
                    }
                );
            })
        });
    };
};

export default ProductPropertiesCore;
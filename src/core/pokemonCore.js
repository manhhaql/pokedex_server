import ErrorParser from '../helper/errorParser';
import MysqlManager from './mysql/mysqlManager';

class PokemonCore {
    constructor() {
        this.get = this.get.bind(this);
        this.getByName = this.getByName.bind(this);
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
                if (options.id !== undefined) {
                    whereData.push(options.id);
                }
                if (options.name !== undefined) {
                    whereData.push(options.name);
                }
                let query = 'SELECT id, name, tag, stage, of_first_stage, height, weight, gender, status, created_at, updated_at FROM pokemon';
                if (whereData.length) {
                    query += ' WHERE';
                    let includeAnd = false;
                    if (options.id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon.id = ?`;
                        includeAnd = true;
                    }
                    if (options.name !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon.name like "%"?"%"`;
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
                        resolve(Array.from(result));
                    }
                )
            });
        });
    };

    getByName(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if (error) {
                    return reject(ErrorParser.handleMysqlError(error));
                }
                let whereData = [];
                if (options.name !== undefined) {
                    whereData.push(options.name);
                }
                let query = 'SELECT id, name, tag, stage, of_first_stage, height, weight, gender, status, created_at, updated_at FROM pokemon';
                if (whereData.length) {
                    query += ' WHERE';
                    let includeAnd = false;
                    if (options.name !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} name = ?`;
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

    countTotal(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if (error) {
                    return reject(ErrorParser.handleMysqlError(error));
                }
                let query = 'SELECT COUNT(id) AS total FROM pokemon';

                connection.query(
                    query,
                    options,
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

                let query = 'INSERT INTO pokemon SET ?';

                connection.query(
                    query,
                    options,
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
                let query = 'UPDATE pokemon SET ?';
                if (options.id !== undefined) {
                    whereData.push(options.id);
                }
                if (whereData.length) {
                    query += ' WHERE';
                    let includeAnd = false;
                    if (options.id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} id = ?`;
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

export default PokemonCore;
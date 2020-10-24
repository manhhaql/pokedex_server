import ErrorParser from '../helper/errorParser';
import MysqlManager from './mysql/mysqlManager';

class PokemonImageCore {
    constructor() {
        this.get = this.get.bind(this);
        this.saveImageToDB = this.saveImageToDB.bind(this);
        this.update = this.update.bind(this);
    };

    get(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if (error) {
                    return reject(ErrorParser.handleMysqlError(error));
                }
                let whereData = [];
                if (options.pokemon_id !== undefined) {
                    whereData.push(options.pokemon_id);
                }
                let query = 'SELECT id, pokemon_id, url, created_at, updated_at FROM pokemon_image';
                if (whereData.length) {
                    query += ' WHERE';
                    let includeAnd = false;
                    if (options.pokemon_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_id = ?`;
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

    saveImageToDB(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if (error) {
                    return reject(ErrorParser.handleMysqlError(error))
                };

                let query = 'INSERT INTO pokemon_image SET ?';

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
                let query = 'UPDATE pokemon_image SET ?';
                if (options.pokemon_id !== undefined) {
                    whereData.push(options.pokemon_id);
                }
                if (whereData.length) {
                    query += ' WHERE';
                    let includeAnd = false;
                    if (options.pokemon_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_id = ?`;
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

export default PokemonImageCore;
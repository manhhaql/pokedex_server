import ErrorParser from '../helper/errorParser';
import MysqlManager from './mysql/mysqlManager';

class PokemonTypeCore {
    constructor() {
        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.delete = this.delete.bind(this);
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
                if (options.type_id !== undefined) {
                    whereData.push(options.type_id);
                }
                let query = 'SELECT pokemon_type.id, pokemon_type.pokemon_id, types.id as type_id, types.name as type_name, pokemon_type.created_at, pokemon_type.updated_at FROM pokemon_type';
                query += ` LEFT JOIN types on pokemon_type.type_id = types.id`
                if (whereData.length) {
                    query += ' WHERE';
                    let includeAnd = false;
                    if (options.pokemon_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_type.pokemon_id = ?`;
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
                        resolve(Array.from(result));
                    }
                )
            });
        });
    };

    set(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if (error) {
                    return reject(ErrorParser.handleMysqlError(error))
                };

                let query = 'INSERT INTO pokemon_type SET ?';

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

    delete(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection)=>{
                if(error) {
                    return reject(ErrorParser.handleMysqlError(error));
                }

                let whereData = [];
                let query = 'DELETE FROM pokemon_type';
                if (options.pokemon_id !== undefined) {
                    whereData.push(options.pokemon_id);
                }
                if (options.type_id !== undefined) {
                    whereData.push(options.type_id);
                }
                if (whereData.length) {
                    query += ' WHERE';
                    let includeAnd = false;
                    if (options.pokemon_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_id = ?`;
                        includeAnd = true;
                    }
                    if (options.type_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} type_id = ?`;
                        includeAnd = true;
                    }
                }

                connection.query(
                    query,
                    whereData,
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

export default PokemonTypeCore;
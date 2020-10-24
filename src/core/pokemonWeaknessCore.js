import ErrorParser from '../helper/errorParser';
import MysqlManager from './mysql/mysqlManager';

class PokemonWeaknessCore {
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
                if (options.weakness_id !== undefined) {
                    whereData.push(options.weakness_id);
                }
                let query = 'SELECT pokemon_weakness.id, pokemon_weakness.pokemon_id, weakness.id as weakness_id, weakness.name as weakness_name, pokemon_weakness.created_at, pokemon_weakness.updated_at FROM pokemon_weakness';
                query += ` LEFT JOIN weakness on pokemon_weakness.weakness_id = weakness.id`
                if (whereData.length) {
                    query += ' WHERE';
                    let includeAnd = false;
                    if (options.pokemon_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_weakness.pokemon_id = ?`;
                        includeAnd = true;
                    }
                    if (options.weakness_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_weakness.weakness_id = ?`;
                        includeAnd = true;
                    }
                }

                connection.query(
                    query,
                    whereData,
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

                let query = 'INSERT INTO pokemon_weakness SET ?';

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
                let query = 'DELETE FROM pokemon_weakness';
                if (options.pokemon_id !== undefined) {
                    whereData.push(options.pokemon_id);
                }
                if (options.weakness_id !== undefined) {
                    whereData.push(options.weakness_id);
                }
                if (whereData.length) {
                    query += ' WHERE';
                    let includeAnd = false;
                    if (options.pokemon_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_id = ?`;
                        includeAnd = true;
                    }
                    if (options.weakness_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} weakness_id = ?`;
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

export default PokemonWeaknessCore;
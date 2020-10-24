import ErrorParser from '../helper/errorParser';
import MysqlManager from './mysql/mysqlManager';

class PokemonAbilityCore {
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
                if (options.ability_id !== undefined) {
                    whereData.push(options.ability_id);
                }
                let query = 'SELECT pokemon_ability.id, pokemon_ability.pokemon_id, ability.id as ability_id, ability.name as ability_name, pokemon_ability.created_at, pokemon_ability.updated_at FROM pokemon_ability';
                query += ` LEFT JOIN ability on pokemon_ability.ability_id = ability.id`
                if (whereData.length) {
                    query += ' WHERE';
                    let includeAnd = false;
                    if (options.pokemon_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_ability.pokemon_id = ?`;
                        includeAnd = true;
                    }
                    if (options.ability_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_ability.ability_id = ?`;
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

                let query = 'INSERT INTO pokemon_ability SET ?';

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
                let query = 'DELETE FROM pokemon_ability';
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
                        query += `${includeAnd ? ' AND' : ''} ability_id = ?`;
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

export default PokemonAbilityCore;
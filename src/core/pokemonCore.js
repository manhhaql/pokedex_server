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
                if (options.type_id !== undefined) {
                    whereData.push(options.type_id);
                }
                if (options.weakness_id !== undefined) {
                    whereData.push(options.weakness_id);
                }
                if (options.ability_id !== undefined) {
                    whereData.push(options.ability_id);
                }
                let query = `SELECT pokemon.id,
                                    pokemon.name, 
                                    pokemon.tag, 
                                    pokemon.stage, 
                                    pokemon.of_basic, 
                                    pokemon.height, 
                                    pokemon.weight, 
                                    pokemon.gender, 
                                    pokemon.status, 
                                    (SELECT JSON_ARRAYAGG(pokemon_type.type_id) 
                                        FROM pokemon_type 
                                        WHERE pokemon_type.pokemon_id = pokemon.id
                                        GROUP BY pokemon_type.pokemon_id) as types,
                                    (SELECT JSON_ARRAYAGG(pokemon_weakness.weakness_id) 
                                        FROM pokemon_weakness 
                                        WHERE pokemon_weakness.pokemon_id = pokemon.id 
                                        GROUP BY pokemon_weakness.pokemon_id) as weakness,
                                    (SELECT JSON_ARRAYAGG(pokemon_ability.ability_id) 
                                        FROM pokemon_ability 
                                        WHERE pokemon_ability.pokemon_id = pokemon.id 
                                        GROUP BY pokemon_ability.pokemon_id) as abilities,
                                    (SELECT pokemon_image.url
                                        FROM pokemon_image
                                        WHERE pokemon_image.pokemon_id = pokemon.id 
                                        GROUP BY pokemon_image.pokemon_id) as image,
                                    pokemon.created_at, 
                                    pokemon.updated_at
                            FROM pokemon`;
                        query += ` LEFT JOIN pokemon_type on pokemon.id = pokemon_type.pokemon_id
                                    LEFT JOIN pokemon_weakness on pokemon.id = pokemon_weakness.pokemon_id
                                    LEFT JOIN pokemon_ability on pokemon.id = pokemon_ability.pokemon_id`

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
                    if (options.type_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_type.type_id = ?`;
                        includeAnd = true;
                    }
                    if (options.weakness_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_weakness.weakness_id = ?`;
                        includeAnd = true;
                    }
                    if (options.ability_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} pokemon_ability.ability_id = ?`;
                        includeAnd = true;
                    }
                }

                query += ` GROUP BY pokemon.id`

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
                let query = 'SELECT id, name, tag, stage, of_basic, height, weight, gender, status, created_at, updated_at FROM pokemon';
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
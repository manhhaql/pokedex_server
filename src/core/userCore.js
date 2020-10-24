import MysqlManager from './mysql/mysqlManager';
import ErrorParser from '../helper/errorParser';

class UserCore {
    constructor() {
        this.get = this.get.bind(this);
        this.getBy = this.getBy.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
    };


    getBy(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if(error) {
                    return reject(ErrorParser.handleMysqlError(error))
                };

                let whereData = [];
                if(options.username !== undefined) {
                    whereData.push(options.username)
                };
                if(options.user_id !== undefined) {
                    whereData.push(options.user_id)
                };

                let query = 'SELECT id, username, password, salt, type, status, created_at, updated_at FROM users';

                if(whereData.length) {
                    query += ' WHERE'
                    let includeAnd = false
                    if(options.username !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} username = ?`,
                        includeAnd = true
                    };
                    if(options.user_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} id = ?`,
                        includeAnd = true
                    };
                };
                
                connection.query(
                    query,
                    whereData.concat([]),
                    (error, result, fields)=>{
                        connection.destroy();
                        if(error) {
                            return reject(ErrorParser.handleMysqlError(error))
                        }
                        resolve(result);
                    }
                )
            })
        })
    };

    get(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if(error) {
                    return reject(ErrorParser.handleMysqlError(error))
                };

                let whereData = [];
                if(options.username !== undefined) {
                    whereData.push(options.username)
                };
                if(options.type !== undefined) {
                    whereData.push(options.type)
                };
                
                let query = 'SELECT id, username, phone, email, avatar, type, status, created_at, updated_at FROM users';

                if(whereData.length) {
                    query += ' WHERE'
                    let includeAnd = false
                    if(options.username !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} username like "%"?"%"`,
                        includeAnd = true
                    };
                    if(options.type !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} type = ?`,
                        includeAnd = true
                    };
                };
                
                connection.query(
                    query,
                    whereData.concat([]),
                    (error, result, fields)=>{
                        connection.destroy();
                        if(error) {
                            return reject(ErrorParser.handleMysqlError(error))
                        }
                        resolve(result);
                    }
                )
            })
        })
    };
    
    create(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if(error) {
                    return reject(ErrorParser.handleMysqlError(error));
                }
                connection.query(
                    'INSERT INTO users SET ?',
                    options,
                    (error, result, fields) => {
                        connection.destroy();
                        if(error) {
                            return reject(ErrorParser.handleMysqlError(error))
                        }
                        resolve(result);
                    }
                )
            })
        });
    };

    update(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if(error) {
                    return reject(ErrorParser.handleMysqlError(error));
                }
                
                let whereData = [];
                if(options.conditions.user_id !== undefined) {
                    whereData.push(options.conditions.user_id)
                };

                let query = 'UPDATE users SET ?'

                if(whereData.length) {
                    query += ' WHERE'
                    let includeAnd = false
                    if(options.conditions.user_id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} id = ?`,
                        includeAnd = true
                    };
                };
                connection.query(
                    query,
                    [options.values].concat(whereData),
                    (error, result, fields) => {
                        connection.destroy();
                        if(error) {
                            return reject(ErrorParser.handleMysqlError(error))
                        }
                        resolve(result);
                    }
                )
            })
        });
    };
};

export default UserCore;
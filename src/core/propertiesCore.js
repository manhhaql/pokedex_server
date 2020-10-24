 import ErrorParser from '../helper/errorParser';
import MysqlManager from './mysql/mysqlManager';

class PropertiesCore {
    constructor() {
        this.getWeakness = this.getWeakness.bind(this);
        this.getType = this.getType.bind(this);
        this.getAbility = this.getAbility.bind(this);
    }

    getType(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if(error) {
                    return reject(ErrorParser.handleMysqlError(error))
                };

                let whereData = [];
                if(options.id !== undefined) {
                    whereData.push(options.id)
                };
                
                let query = 'SELECT id, name FROM types';

                if(whereData.length) {
                    query += ' WHERE'
                    let includeAnd = false
                    if(options.id !== undefined) {
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

    getWeakness(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if(error) {
                    return reject(ErrorParser.handleMysqlError(error))
                };

                let whereData = [];
                if(options.id !== undefined) {
                    whereData.push(options.id)
                };
                
                let query = 'SELECT id, name FROM weakness';

                if(whereData.length) {
                    query += ' WHERE'
                    let includeAnd = false
                    if(options.id !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} id = ?`,
                        includeAnd = true
                    };
                };
                
                connection.query(
                    query,
                    whereData,
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

    getAbility(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if(error) {
                    return reject(ErrorParser.handleMysqlError(error))
                };

                let whereData = [];
                if(options.id !== undefined) {
                    whereData.push(options.id)
                };
                
                let query = 'SELECT id, name, description FROM ability';

                if(whereData.length) {
                    query += ' WHERE'
                    let includeAnd = false
                    if(options.id !== undefined) {
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
};

export default PropertiesCore;
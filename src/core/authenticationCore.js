import MysqlManager from './mysql/mysqlManager';
import ErrorParser from '../helper/errorParser';

class AuthenticationCore {
    constructor() {
        this.createSession = this.createSession.bind(this);
    };


    createSession(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection) => {
                if (error) {
                    return reject(ErrorParser.handleMysqlError(error));
                }
                
                let query = 'INSERT INTO authentication_session SET ?';
                let sessionData = {
                    user_id: options.user_id,
                    token: options.token
                }
                connection.query(
                    query,
                    sessionData,
                    (error, results, fields) => {
                        connection.destroy();
                        if (error) {
                            return reject(ErrorParser.handleMysqlError(error));
                        }
                        resolve(results);
                    }
                );
            });
        });
    };

    updateSessionStatus(options) {
        return new Promise((resolve, reject) => {
            MysqlManager.pool.getConnection((error, connection)=>{
                if(error) {
                    return reject(ErrorParser.handleMysqlError(error));
                }

                let whereData = [];
                let query = 'UPDATE authentication_session set status = 1';
                if (options.token !== undefined) {
                    whereData.push(options.token);
                }
                if (whereData.length) {
                    query += ' WHERE id > 0 AND';
                    let includeAnd = false;
                    if (options.token !== undefined) {
                        query += `${includeAnd ? ' AND' : ''} token = ?`;
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

export default AuthenticationCore;
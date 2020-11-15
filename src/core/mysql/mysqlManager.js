import mysql from 'mysql';
import config from '../../config';

class MysqlManager {};

MysqlManager.pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL || {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    connectionLimit: config.mysql.connectionLimit
});

export default MysqlManager;
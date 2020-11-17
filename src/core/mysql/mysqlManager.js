import mysql from 'mysql';
import config from '../../config';

class MysqlManager {};

const mysqlConfig = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    connectionLimit: config.mysql.connectionLimit
};

MysqlManager.pool = mysql.createPool(process.env.JAWSDB_URL || mysqlConfig);

export default MysqlManager;
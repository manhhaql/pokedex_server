import * as responseCode from '../constant/responseCode';

class ErrorParser {
    static handleJoiError(error) {
        return {
            code: responseCode.ERR_VALIDATION,
            error: error.details[0].message
        }
    }
    static handleMysqlError(error) {
        return {
            code: responseCode.ERR_MYSQL,
            error: error.sqlMessage
        }
    }
    static handleRedisError(error) {
        return {
            code: responseCode.ERROR_REDIS,
            error: error
        };
    };
};

export default ErrorParser;
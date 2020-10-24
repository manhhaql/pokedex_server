import RedisManager from './redisManager';
import config from '../../config';
import ErrorParser from '../../helper/errorParser';

class RedisCore {
    constructor () {};

    setRedisToken(options) {
        return new Promise((resolve, reject) => {
            if(!RedisManager.connected) {
                return reject(
                    ErrorParser.handleRedisError('Redis is not connected')
                )
            }
            RedisManager.client.set(options.token, JSON.stringify(options.data), 'EX', config.authentication.tokenLastTime, (error, result) => {
                if(error) {
                    return reject(
                        ErrorParser.handleRedisError('Redis set token error')
                    )
                }
                return resolve({});
            })
        })
    };

    getRedisToken(options) {
        return new Promise((resolve, reject) => {
            if(!RedisManager.connected) {
                return reject(
                    ErrorParser.handleRedisError('Redis is not connected')
                )
            }
            RedisManager.client.get(options.token, (error, result) => {
                if(error) {
                    return reject(
                        ErrorParser.handleRedisError('Redis get token error')
                    )
                }
                if(!result) {
                    return resolve(null)
                }
                return resolve(JSON.parse(result));
            })
        })
    };

    removeRedisToken(options) {
        return new Promise((resolve, reject) => {
            if(!RedisManager.connected) {
                return reject(
                    ErrorParser.handleRedisError('Redis is not connected')
                )
            }
            RedisManager.client.del(options.token, (error, result) => {
                if(error) {
                    return reject(
                        ErrorParser.handleRedisError('Redis remove token error')
                    )
                }
                return resolve({});
            })
        })
    };
};

export default RedisCore;
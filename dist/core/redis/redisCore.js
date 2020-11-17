'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redisManager = require('./redisManager');

var _redisManager2 = _interopRequireDefault(_redisManager);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _errorParser = require('../../helper/errorParser');

var _errorParser2 = _interopRequireDefault(_errorParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RedisCore = function () {
    function RedisCore() {
        _classCallCheck(this, RedisCore);
    }

    _createClass(RedisCore, [{
        key: 'setRedisToken',
        value: function setRedisToken(options) {
            return new Promise(function (resolve, reject) {
                if (!_redisManager2.default.connected) {
                    return reject(_errorParser2.default.handleRedisError('Redis is not connected'));
                }
                _redisManager2.default.client.set(options.token, JSON.stringify(options.data), 'EX', _config2.default.authentication.tokenLastTime, function (error, result) {
                    if (error) {
                        return reject(_errorParser2.default.handleRedisError('Redis set token error'));
                    }
                    return resolve({});
                });
            });
        }
    }, {
        key: 'getRedisToken',
        value: function getRedisToken(options) {
            return new Promise(function (resolve, reject) {
                if (!_redisManager2.default.connected) {
                    return reject(_errorParser2.default.handleRedisError('Redis is not connected'));
                }
                _redisManager2.default.client.get(options.token, function (error, result) {
                    if (error) {
                        return reject(_errorParser2.default.handleRedisError('Redis get token error'));
                    }
                    if (!result) {
                        return resolve(null);
                    }
                    return resolve(JSON.parse(result));
                });
            });
        }
    }, {
        key: 'removeRedisToken',
        value: function removeRedisToken(options) {
            return new Promise(function (resolve, reject) {
                if (!_redisManager2.default.connected) {
                    return reject(_errorParser2.default.handleRedisError('Redis is not connected'));
                }
                _redisManager2.default.client.del(options.token, function (error, result) {
                    if (error) {
                        return reject(_errorParser2.default.handleRedisError('Redis remove token error'));
                    }
                    return resolve({});
                });
            });
        }
    }]);

    return RedisCore;
}();

;

exports.default = RedisCore;
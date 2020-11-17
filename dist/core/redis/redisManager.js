'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RedisManager = function RedisManager() {
    _classCallCheck(this, RedisManager);
};

;

RedisManager.client = _redis2.default.createClient(process.env.REDISCLOUD_URL || {
    host: _config2.default.redis.host,
    port: _config2.default.redis.port,
    password: _config2.default.redis.password,
    db: _config2.default.redis.db
});
RedisManager.connected = false;

RedisManager.client.on('ready', function (error) {
    RedisManager.connected = true;
});

RedisManager.client.on('connect', function (error) {});
RedisManager.client.on('reconnecting', function (error) {
    console.log(25, error);
});
RedisManager.client.on('connect', function (error) {});
RedisManager.client.on('error', function (error) {
    RedisManager.connected = false;
});
RedisManager.client.on('warning', function (error) {});
RedisManager.client.on('end', function (error) {});

exports.default = RedisManager;
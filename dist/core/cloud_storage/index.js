'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bucket = exports.storage = undefined;

var _storage = require('@google-cloud/storage');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storage = exports.storage = new _storage.Storage({
    projectId: _config2.default.firebase.projectId,
    keyFilename: _path2.default.join(__dirname, '../../../ServiceAccountKey.json')
});

var bucket = exports.bucket = storage.bucket(_config2.default.firebase.storageBucket);
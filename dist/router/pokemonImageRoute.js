'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _errorParser = require('../helper/errorParser');

var _errorParser2 = _interopRequireDefault(_errorParser);

var _responseCode = require('../constant/responseCode');

var responseCode = _interopRequireWildcard(_responseCode);

var _data = require('../constant/data');

var dataConstant = _interopRequireWildcard(_data);

var _file = require('../constant/file');

var fileConstant = _interopRequireWildcard(_file);

var _folder = require('../constant/folder');

var folderConstant = _interopRequireWildcard(_folder);

var _cloud_storage = require('../core/cloud_storage');

var cloudStorage = _interopRequireWildcard(_cloud_storage);

var _redisCore = require('../core/redis/redisCore');

var _redisCore2 = _interopRequireDefault(_redisCore);

var _userCore = require('../core/userCore');

var _userCore2 = _interopRequireDefault(_userCore);

var _pokemonImageCore = require('../core/pokemonImageCore');

var _pokemonImageCore2 = _interopRequireDefault(_pokemonImageCore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var multer = (0, _multer2.default)({
    storage: _multer2.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

var uploadImageToStorage = function uploadImageToStorage(file, pokemon_id) {
    return new Promise(function (resolve, reject) {
        if (!file) {
            reject('No image file');
        }
        var newFileName = file.originalname + '_' + Date.now();

        var fileUpload = cloudStorage.bucket.file(folderConstant.IMAGES + '/' + pokemon_id + '_' + newFileName);

        var blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', function (error) {
            reject(error);
        });

        blobStream.on('finish', function () {
            var url = 'https://storage.googleapis.com/' + cloudStorage.bucket.name + '/' + fileUpload.name;
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
};

var PokemonImageRoute = function () {
    function PokemonImageRoute() {
        _classCallCheck(this, PokemonImageRoute);

        this.redisCore = new _redisCore2.default();
        this.userCore = new _userCore2.default();
        this.pokemonImageCore = new _pokemonImageCore2.default();

        this.router = _express2.default.Router();
        this.routes();
    }

    _createClass(PokemonImageRoute, [{
        key: 'upload',
        value: function upload(req, res, next) {
            var _this = this;

            var authorizationToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : '';

            if (!authorizationToken) {
                return res.status(400).json(_errorParser2.default.handleAuthenticationError("Authorization token is missing"));
            }

            var _Joi$validate = _joi2.default.validate({
                token: authorizationToken,
                value: req.body

            }, {
                token: _joi2.default.string().required(),
                value: _joi2.default.object().keys({
                    pokemon_id: _joi2.default.number().integer().min(1).required()
                }).unknown()
            }),
                paramError = _Joi$validate.error,
                paramValues = _Joi$validate.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

            if (!req.files || !req.files.file || !req.files.file.length) {
                var error = {
                    code: responseCode.ERR_VALIDATION,
                    error: 'file is required'
                };
                return res.status(400).json(error);
            };

            var selectedFile = req.files.file[0];
            var url = void 0;

            if (!selectedFile.mimetype.includes(fileConstant.FILE_TYPE_IMAGE)) {
                var _error = {
                    code: responseCode.ERR_VALIDATION,
                    error: 'File type is not image'
                };

                return res.status(400).json(_error);
            };

            this.redisCore.getRedisToken({
                token: paramValues.token
            }).then(function (result) {
                if (!result) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_TOKEN_NOT_FOUND,
                            error: 'Token not found'
                        });
                    });
                }
                return _this.userCore.getBy({
                    id: result.user.id
                });
            }).then(function (result) {
                if (result[0].status !== dataConstant.STATUS_ACTIVE) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_STATUS_INACTIVE,
                            error: "User is inactive"
                        });
                    });
                }

                if (result[0].type !== dataConstant.USER_ADMIN) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_PERMISSION_REQUIRED,
                            error: "You are not admin"
                        });
                    });
                }

                return _this.pokemonImageCore.get({
                    pokemon_id: paramValues.value.pokemon_id
                });
            }).then(function (result) {
                if (result.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_PRODUCT_IMAGE_EXISTS,
                            error: 'This pokemon already have image'
                        });
                    });
                }
                return uploadImageToStorage(selectedFile, paramValues.value.pokemon_id);
            }).then(function (result) {

                url = result;
                return new Promise(function (resolve, reject) {
                    _this.pokemonImageCore.saveImageToDB({
                        pokemon_id: paramValues.value.pokemon_id,
                        url: url
                    }).then(function (result) {
                        resolve(result);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }).then(function (result) {
                return res.status(200).json({
                    code: responseCode.SUCCESS,
                    data: {
                        pokemon_id: paramValues.value.pokemon_id,
                        url: url
                    }
                });
            }).catch(function (error) {
                return res.status(400).json(error);
            });
        }
    }, {
        key: 'update',
        value: function update(req, res, next) {
            var _this2 = this;

            var authorizationToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : '';

            if (!authorizationToken) {
                return res.status(400).json(_errorParser2.default.handleAuthenticationError("Authorization token is missing"));
            }

            var _Joi$validate2 = _joi2.default.validate({
                token: authorizationToken,
                value: req.body

            }, {
                token: _joi2.default.string().required(),
                value: _joi2.default.object().keys({
                    pokemon_id: _joi2.default.number().integer().min(1).required()
                }).unknown()
            }),
                paramError = _Joi$validate2.error,
                paramValues = _Joi$validate2.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

            if (!req.files || !req.files.file || !req.files.file.length) {
                var error = {
                    code: responseCode.ERR_VALIDATION,
                    error: 'file is required'
                };
                return res.status(400).json(error);
            };

            var selectedFile = req.files.file[0];
            var url = void 0;

            if (!selectedFile.mimetype.includes(fileConstant.FILE_TYPE_IMAGE)) {
                var _error2 = {
                    code: responseCode.ERR_VALIDATION,
                    error: 'File type is not image'
                };

                return res.status(400).json(_error2);
            };

            this.redisCore.getRedisToken({
                token: paramValues.token
            }).then(function (result) {
                if (!result) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_TOKEN_NOT_FOUND,
                            error: 'Token not found'
                        });
                    });
                }
                return _this2.userCore.getBy({
                    id: result.user.id
                });
            }).then(function (result) {
                if (result[0].status !== dataConstant.STATUS_ACTIVE) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_STATUS_INACTIVE,
                            error: "User is inactive"
                        });
                    });
                }

                if (result[0].type !== dataConstant.USER_ADMIN) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_PERMISSION_REQUIRED,
                            error: "You don't have permission to update pokemon image"
                        });
                    });
                }

                return _this2.pokemonImageCore.get({
                    pokemon_id: paramValues.value.pokemon_id
                });
            }).then(function (result) {
                if (!result.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_DATA_NOT_FOUND,
                            error: "This pokemon don't have image yet"
                        });
                    });
                }

                return uploadImageToStorage(selectedFile, paramValues.value.pokemon_id);
            }).then(function (result) {

                url = result;
                return new Promise(function (resolve, reject) {
                    _this2.pokemonImageCore.update({
                        pokemon_id: paramValues.value.pokemon_id,
                        values: { url: url }
                    }).then(function (result) {
                        resolve(result);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }).then(function (result) {
                return res.status(200).json({
                    code: responseCode.SUCCESS,
                    data: {
                        pokemon_id: paramValues.value.pokemon_id,
                        url: url
                    }
                });
            }).catch(function (error) {
                console.log(error);
                return res.status(400).json(error);
            });
        }
    }, {
        key: 'list',
        value: function list(req, res, next) {
            var _Joi$validate3 = _joi2.default.validate(req.query, _joi2.default.object().keys({
                pokemon_id: _joi2.default.number().integer(),
                page: _joi2.default.number().positive().not(0).default(1),
                limit: _joi2.default.number().positive().not(0).max(500).default(10)
            }).unknown()),
                paramError = _Joi$validate3.error,
                paramValues = _Joi$validate3.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

            this.pokemonImageCore.get({
                pokemon_id: paramValues.pokemon_id,
                page: paramValues.page,
                limit: paramValues.limit
            }).then(function (result) {
                return res.status(200).json({
                    code: responseCode.SUCCESS,
                    data: result
                });
            }).catch(function (error) {
                return res.status(400).json(error);
            });
        }
    }, {
        key: 'routes',
        value: function routes() {
            this.router.post('/upload', multer.fields([{ name: 'file', maxCount: 1 }]), this.upload.bind(this));
            this.router.post('/update', multer.fields([{ name: 'file', maxCount: 1 }]), this.update.bind(this));
            this.router.get('/list', this.list.bind(this));
        }
    }]);

    return PokemonImageRoute;
}();

;

exports.default = PokemonImageRoute;
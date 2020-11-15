'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _errorParser = require('../helper/errorParser');

var _errorParser2 = _interopRequireDefault(_errorParser);

var _responseCode = require('../constant/responseCode');

var responseCode = _interopRequireWildcard(_responseCode);

var _data = require('../constant/data');

var dataConstant = _interopRequireWildcard(_data);

var _redisCore = require('../core/redis/redisCore');

var _redisCore2 = _interopRequireDefault(_redisCore);

var _userCore = require('../core/userCore');

var _userCore2 = _interopRequireDefault(_userCore);

var _pokemonWeaknessCore = require('../core/pokemonWeaknessCore');

var _pokemonWeaknessCore2 = _interopRequireDefault(_pokemonWeaknessCore);

var _propertiesCore = require('../core/propertiesCore');

var _propertiesCore2 = _interopRequireDefault(_propertiesCore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PokemonWeaknessRoute = function () {
    function PokemonWeaknessRoute() {
        _classCallCheck(this, PokemonWeaknessRoute);

        this.redisCore = new _redisCore2.default();
        this.userCore = new _userCore2.default();
        this.pokemonWeaknessCore = new _pokemonWeaknessCore2.default();
        this.propertiesCore = new _propertiesCore2.default();

        this.router = _express2.default.Router();
        this.routes();
    }

    _createClass(PokemonWeaknessRoute, [{
        key: 'list',
        value: function list(req, res, next) {
            var _Joi$validate = _joi2.default.validate(req.query, _joi2.default.object().keys({
                weakness_id: _joi2.default.number().integer().min(1),
                pokemon_id: _joi2.default.number().integer().min(1),
                page: _joi2.default.number().positive().not(0).default(1),
                limit: _joi2.default.number().positive().not(0).max(500).default(10)
            }).unknown()),
                paramError = _Joi$validate.error,
                paramValues = _Joi$validate.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

            this.pokemonWeaknessCore.get({
                weakness_id: paramValues.weakness_id,
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
        key: 'set',
        value: function set(req, res, next) {
            var _this = this;

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
                    pokemon_id: _joi2.default.number().integer().min(1).required(),
                    weakness: _joi2.default.array().items(_joi2.default.number().integer())
                }).unknown()
            }),
                paramError = _Joi$validate2.error,
                paramValues = _Joi$validate2.value;

            var returnData = void 0;
            var weaknessData = void 0;
            var setWeaknessData = paramValues.value.weakness;
            var differents = [];

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

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
                return _this.propertiesCore.getWeakness({});
            }).then(function (result) {
                weaknessData = result.map(function (weakness) {
                    return weakness.id;
                });
                differents = setWeaknessData.filter(function (a) {
                    return !weaknessData.includes(a);
                });
                if (differents.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_MYSQL,
                            error: 'weakness = [' + differents + '] not exists'
                        });
                    });
                }
            }).then(function (result) {
                return _this.pokemonWeaknessCore.delete({
                    pokemon_id: paramValues.value.pokemon_id
                });
            }).then(function (results) {
                return Promise.all(paramValues.value.weakness.map(function (weakness_id) {
                    return new Promise(function (resolve, reject) {
                        _this.pokemonWeaknessCore.set({
                            pokemon_id: paramValues.value.pokemon_id,
                            weakness_id: weakness_id
                        }).then(function (result) {
                            resolve(result);
                        }).catch(function (error) {
                            reject(error);
                        });
                    });
                }));
            }).then(function (result) {
                return new Promise(function (resolve, reject) {
                    _this.pokemonWeaknessCore.get({
                        pokemon_id: paramValues.value.pokemon_id
                    }).then(function (result) {
                        resolve(result);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }).then(function (result) {
                returnData = result;
                return res.status(200).json({
                    code: responseCode.SUCCESS,
                    data: returnData
                });
            }).catch(function (error) {
                return res.status(400).json(error);
            });
        }
    }, {
        key: 'routes',
        value: function routes() {
            this.router.get('/list', this.list.bind(this));
            this.router.post('/set', this.set.bind(this));
        }
    }]);

    return PokemonWeaknessRoute;
}();

;

exports.default = PokemonWeaknessRoute;
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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserRoute = function () {
    function UserRoute() {
        _classCallCheck(this, UserRoute);

        this.redisCore = new _redisCore2.default();
        this.userCore = new _userCore2.default();

        this.router = _express2.default.Router();
        this.routes();
    }

    _createClass(UserRoute, [{
        key: 'userInfo',
        value: function userInfo(req, res, next) {
            var _this = this;

            var authorizationToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : '';

            if (!authorizationToken) {
                return res.status(400).json(_errorParser2.default.handleAuthenticationError("Authorization token is missing"));
            }

            var _Joi$validate = _joi2.default.validate({
                token: authorizationToken
            }, {
                token: _joi2.default.string().required()
            }),
                paramError = _Joi$validate.error,
                paramValues = _Joi$validate.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }
            var responseData = {};

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

                responseData.token = result.token;

                return _this.userCore.getBy({
                    id: result.user.id
                });
            }).then(function (result) {
                if (!result.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_DATA_NOT_FOUND,
                            error: 'User not found'
                        });
                    });
                }
                responseData.user = result[0];
                return res.status(200).json({
                    code: responseCode.SUCCESS,
                    data: responseData
                });
            }).catch(function (error) {
                return res.status(400).json(error);
            });
        }
    }, {
        key: 'list',
        value: function list(req, res, next) {
            var _this2 = this;

            var authorizationToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : '';

            if (!authorizationToken) {
                return res.status(400).json(_errorParser2.default.handleAuthenticationError("Authorization token is missing"));
            }

            var _Joi$validate2 = _joi2.default.validate({
                token: authorizationToken,
                value: req.query
            }, {
                token: _joi2.default.string().required(),
                value: _joi2.default.object().keys({
                    username: _joi2.default.string().regex(/^[a-zA-Z0-9, ]*$/),
                    id: _joi2.default.number().integer().positive(),
                    type: _joi2.default.number().integer().valid(1, 2),
                    status: _joi2.default.number().integer().valid(1, 2)
                }).unknown()
            }),
                paramError = _Joi$validate2.error,
                paramValues = _Joi$validate2.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

            var returnData = void 0;
            var total = void 0;

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
                            error: "You are not admin"
                        });
                    });
                }
                return _this2.userCore.get({
                    username: paramValues.value.username,
                    id: paramValues.value.id,
                    type: paramValues.value.type,
                    status: paramValues.value.status
                });
            }).then(function (result) {
                returnData = result;
                return _this2.userCore.countTotal({});
            }).then(function (result) {
                total = result[0].total;
            }).then(function (result) {
                return res.status(200).json({
                    code: responseCode.SUCCESS,
                    total: total,
                    data: returnData
                });
            }).catch(function (error) {
                return res.status(400).json(error);
            });
        }
    }, {
        key: 'update',
        value: function update(req, res, next) {
            var _this3 = this;

            var authorizationToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : '';

            if (!authorizationToken) {
                return res.status(400).json(_errorParser2.default.handleAuthenticationError("Authorization token is missing"));
            }

            var _Joi$validate3 = _joi2.default.validate({
                token: authorizationToken,
                value: req.body
            }, {
                token: _joi2.default.string().required(),
                value: _joi2.default.object().keys({
                    id: _joi2.default.number().integer().positive().required(),
                    username: _joi2.default.string().regex(/^[a-zA-Z0-9, ]*$/),
                    type: _joi2.default.number().integer().valid(1, 2),
                    status: _joi2.default.number().integer().valid(1, 2)
                }).unknown()
            }),
                paramError = _Joi$validate3.error,
                paramValues = _Joi$validate3.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

            var values = {};
            if (paramValues.value.type) {
                values.type = paramValues.value.type;
            }
            if (paramValues.value.status) {
                values.status = paramValues.value.status;
            }
            if (paramValues.value.username) {
                values.username = paramValues.value.username;
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

                return _this3.userCore.getBy({
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
                return _this3.userCore.get({
                    id: paramValues.value.id
                });
            }).then(function (result) {
                if (!result.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_DATA_NOT_FOUND,
                            error: "User not found"
                        });
                    });
                }
                return _this3.userCore.update({
                    id: paramValues.value.id,
                    values: values
                });
            }).then(function (result) {
                return _this3.userCore.get({
                    id: paramValues.value.id
                });
            }).then(function (result) {
                return res.status(200).json({
                    code: responseCode.SUCCESS,
                    data: result[0]
                });
            }).catch(function (error) {
                return res.status(400).json(error);
            });
        }
    }, {
        key: 'routes',
        value: function routes() {
            this.router.get('/user-info', this.userInfo.bind(this));
            this.router.get('/', this.list.bind(this));
            this.router.put('/update', this.update.bind(this));
        }
    }]);

    return UserRoute;
}();

;

exports.default = UserRoute;
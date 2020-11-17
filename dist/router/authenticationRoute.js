'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _uuid = require('uuid');

var _responseCode = require('../constant/responseCode');

var responseCode = _interopRequireWildcard(_responseCode);

var _errorParser = require('../helper/errorParser');

var _errorParser2 = _interopRequireDefault(_errorParser);

var _encryption = require('../helper/encryption');

var _encryption2 = _interopRequireDefault(_encryption);

var _userCore = require('../core/userCore');

var _userCore2 = _interopRequireDefault(_userCore);

var _authenticationCore = require('../core/authenticationCore');

var _authenticationCore2 = _interopRequireDefault(_authenticationCore);

var _redisCore = require('../core/redis/redisCore');

var _redisCore2 = _interopRequireDefault(_redisCore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthenticationRoute = function () {
    function AuthenticationRoute() {
        _classCallCheck(this, AuthenticationRoute);

        this.userCore = new _userCore2.default();
        this.authenticationCore = new _authenticationCore2.default();
        this.redisCore = new _redisCore2.default();

        this.encryption = new _encryption2.default();

        this.router = _express2.default.Router();
        this.routes();
    }

    _createClass(AuthenticationRoute, [{
        key: 'signup',
        value: function signup(req, res, next) {
            var _this = this;

            var _Joi$validate = _joi2.default.validate(req.body, _joi2.default.object().keys({
                type: _joi2.default.number().integer().valid(1, 2).required(),
                email: _joi2.default.string(),
                username: _joi2.default.string().regex(/^[a-zA-Z0-9, ]*$/).required(),
                password: _joi2.default.string().required(),
                password_check: _joi2.default.string().required()
            }).unknown()),
                paramError = _Joi$validate.error,
                paramValues = _Joi$validate.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            };

            if (paramValues.password !== paramValues.password_check) {
                return res.status(400).json({
                    code: responseCode.ERR_VALIDATION,
                    error: 'Password not match'
                });
            }

            var authData = {};

            var salt = this.encryption.makeSalt().salt;
            var encryptedPassword = this.encryption.validatePassword(paramValues.password, salt);

            this.userCore.getBy({
                username: paramValues.username
            }).then(function (result) {
                if (result.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_DATA_EXISTS,
                            error: 'Username was taken'
                        });
                    });
                }

                authData.token = (0, _uuid.v4)();

                return _this.userCore.create({
                    type: paramValues.type,
                    email: paramValues.email,
                    username: paramValues.username,
                    password: encryptedPassword,
                    salt: salt
                });
            }).then(function (result) {
                return _this.userCore.getBy({
                    id: result.insertId
                });
            }).then(function (result) {
                console.log(78, result);
                authData.user = result[0];
                return _this.authenticationCore.createSession({
                    token: authData.token,
                    user_id: authData.user.id
                });
            }).then(function (result) {
                return _this.redisCore.setRedisToken({
                    token: authData.token,
                    data: authData
                });
            }).then(function (result) {
                return res.status(200).json({
                    code: responseCode.SUCCESS,
                    data: authData
                });
            }).catch(function (error) {
                return res.status(400).json(error);
            });
        }
    }, {
        key: 'signin',
        value: function signin(req, res, next) {
            var _this2 = this;

            var _Joi$validate2 = _joi2.default.validate(req.body, _joi2.default.object().keys({
                username: _joi2.default.string().regex(/^[a-zA-Z0-9, ]*$/).required(),
                password: _joi2.default.string().required()
            }).unknown()),
                paramError = _Joi$validate2.error,
                paramValues = _Joi$validate2.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            };

            var authData = {};

            this.userCore.getBy({
                username: paramValues.username
            }).then(function (result) {
                if (!result.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_DATA_NOT_FOUND,
                            error: 'Username not found'
                        });
                    });
                }

                authData.token = (0, _uuid.v4)();
                authData.user = result[0];

                return new Promise(function (resolve, reject) {
                    return resolve(result[0]);
                });
            }).then(function (result) {
                var savedSalt = result.salt;
                var savedPassword = result.password;
                var typedPassword = _this2.encryption.validatePassword(paramValues.password, savedSalt);

                if (savedPassword !== typedPassword) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_VALIDATION,
                            error: 'Password is not correct'
                        });
                    });
                }

                return _this2.authenticationCore.createSession({
                    token: authData.token,
                    user_id: authData.user.id
                });
            }).then(function (result) {
                return _this2.redisCore.setRedisToken({
                    token: authData.token,
                    data: authData
                });
            }).then(function (result) {
                return res.status(200).json({
                    code: responseCode.SUCCESS,
                    data: authData
                });
            }).catch(function (error) {
                return res.status(400).json(error);
            });
        }
    }, {
        key: 'signout',
        value: function signout(req, res, next) {
            var _this3 = this;

            var authorizationToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : '';

            if (!authorizationToken) {
                return res.status(400).json(_errorParser2.default.handleAuthenticationError("Authorization token is missing"));
            }

            var _Joi$validate3 = _joi2.default.validate({
                token: authorizationToken
            }, {
                token: _joi2.default.string().required()
            }),
                paramError = _Joi$validate3.error,
                paramValues = _Joi$validate3.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            };

            this.redisCore.getRedisToken({
                token: paramValues.token
            }).then(function (result) {
                if (!result) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_DATA_NOT_FOUND,
                            error: 'Token not found'
                        });
                    });
                };

                return Promise.all([_this3.redisCore.removeRedisToken({
                    token: paramValues.token
                }), _this3.authenticationCore.updateSessionStatus({
                    token: paramValues.token
                })]);
            }).then(function (result) {
                return res.status(200).json({
                    code: responseCode.SUCCESS,
                    data: 'Sign out success'
                });
            }).catch(function (error) {
                return res.status(400).json(error);
            });
        }
    }, {
        key: 'routes',
        value: function routes() {
            this.router.post('/signup', this.signup.bind(this));
            this.router.post('/signin', this.signin.bind(this));
            this.router.post('/signout', this.signout.bind(this));
        }
    }]);

    return AuthenticationRoute;
}();

;

exports.default = AuthenticationRoute;
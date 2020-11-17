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

var _propertiesCore = require('../core/propertiesCore');

var _propertiesCore2 = _interopRequireDefault(_propertiesCore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PropertiesRoute = function () {
    function PropertiesRoute() {
        _classCallCheck(this, PropertiesRoute);

        this.propertiesCore = new _propertiesCore2.default();

        this.router = _express2.default.Router();
        this.routes();
    }

    _createClass(PropertiesRoute, [{
        key: 'get_weakness',
        value: function get_weakness(req, res, next) {
            var _Joi$validate = _joi2.default.validate(req.query, _joi2.default.object().keys({
                id: _joi2.default.number().integer().min(1)
            }).unknown()),
                paramError = _Joi$validate.error,
                paramValues = _Joi$validate.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

            this.propertiesCore.getWeakness({
                id: paramValues.id
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
        key: 'get_type',
        value: function get_type(req, res, next) {
            var _Joi$validate2 = _joi2.default.validate(req.query, _joi2.default.object().keys({
                id: _joi2.default.number().integer().min(1)
            }).unknown()),
                paramError = _Joi$validate2.error,
                paramValues = _Joi$validate2.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

            this.propertiesCore.getType({
                id: paramValues.id
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
        key: 'get_ability',
        value: function get_ability(req, res, next) {
            var _Joi$validate3 = _joi2.default.validate(req.query, _joi2.default.object().keys({
                id: _joi2.default.number().integer().min(1)
            }).unknown()),
                paramError = _Joi$validate3.error,
                paramValues = _Joi$validate3.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

            this.propertiesCore.getAbility({
                id: paramValues.id
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
            this.router.get('/weakness', this.get_weakness.bind(this));
            this.router.get('/type', this.get_type.bind(this));
            this.router.get('/ability', this.get_ability.bind(this));
        }
    }]);

    return PropertiesRoute;
}();

;

exports.default = PropertiesRoute;
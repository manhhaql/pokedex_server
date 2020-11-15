'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _responseCode = require('../constant/responseCode');

var responseCode = _interopRequireWildcard(_responseCode);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ErrorParser = function () {
    function ErrorParser() {
        _classCallCheck(this, ErrorParser);
    }

    _createClass(ErrorParser, null, [{
        key: 'handleJoiError',
        value: function handleJoiError(error) {
            return {
                code: responseCode.ERR_VALIDATION,
                error: error.details[0].message
            };
        }
    }, {
        key: 'handleMysqlError',
        value: function handleMysqlError(error) {
            return {
                code: responseCode.ERR_MYSQL,
                error: error.sqlMessage
            };
        }
    }, {
        key: 'handleRedisError',
        value: function handleRedisError(error) {
            return {
                code: responseCode.ERROR_REDIS,
                error: error
            };
        }
    }, {
        key: 'handleAuthenticationError',
        value: function handleAuthenticationError(error) {
            return {
                code: responseCode.ERROR_AUTHENTICATION,
                error: error
            };
        }
    }]);

    return ErrorParser;
}();

;

exports.default = ErrorParser;
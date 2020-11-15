'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Encryption = function () {
    function Encryption() {
        _classCallCheck(this, Encryption);

        this.makeSalt = this.makeSalt.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
    }

    _createClass(Encryption, [{
        key: 'makeSalt',
        value: function makeSalt() {
            var saltLength = 20;var result = {
                salt: ''
            };

            result.salt = _crypto2.default.randomBytes(Math.ceil(saltLength / 2)).toString('hex').slice(0, saltLength);

            return result;
        }
    }, {
        key: 'validatePassword',
        value: function validatePassword(typedPassword, savedSalt) {
            return _crypto2.default.createHmac('sha256', savedSalt).update(typedPassword).digest('hex');
        }
    }]);

    return Encryption;
}();

;

exports.default = Encryption;
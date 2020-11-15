'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _hello_route = require('./hello_route');

var _hello_route2 = _interopRequireDefault(_hello_route);

var _authenticationRoute = require('./authenticationRoute');

var _authenticationRoute2 = _interopRequireDefault(_authenticationRoute);

var _pokemonRoute = require('./pokemonRoute');

var _pokemonRoute2 = _interopRequireDefault(_pokemonRoute);

var _propertiesRoute = require('./propertiesRoute');

var _propertiesRoute2 = _interopRequireDefault(_propertiesRoute);

var _pokemonTypeRoute = require('./pokemonTypeRoute');

var _pokemonTypeRoute2 = _interopRequireDefault(_pokemonTypeRoute);

var _pokemonWeaknessRoute = require('./pokemonWeaknessRoute');

var _pokemonWeaknessRoute2 = _interopRequireDefault(_pokemonWeaknessRoute);

var _pokemonAbilityRoute = require('./pokemonAbilityRoute');

var _pokemonAbilityRoute2 = _interopRequireDefault(_pokemonAbilityRoute);

var _pokemonImageRoute = require('./pokemonImageRoute');

var _pokemonImageRoute2 = _interopRequireDefault(_pokemonImageRoute);

var _userRoute = require('./userRoute');

var _userRoute2 = _interopRequireDefault(_userRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppRoute = function () {
    function AppRoute() {
        _classCallCheck(this, AppRoute);

        this.helloRoute = new _hello_route2.default();
        this.authenticationRoute = new _authenticationRoute2.default();
        this.pokemonRoute = new _pokemonRoute2.default();
        this.propertiesRoute = new _propertiesRoute2.default();
        this.pokemonTypeRoute = new _pokemonTypeRoute2.default();
        this.pokemonWeaknessRoute = new _pokemonWeaknessRoute2.default();
        this.pokemonAbilityRoute = new _pokemonAbilityRoute2.default();
        this.pokemonImageRoute = new _pokemonImageRoute2.default();
        this.userRoute = new _userRoute2.default();

        this.express = (0, _express2.default)();
        this.middleware();
        this.routes();
    }

    _createClass(AppRoute, [{
        key: 'middleware',
        value: function middleware() {
            this.express.use((0, _cors2.default)());
            this.express.use((0, _morgan2.default)('dev'));
            this.express.use(_bodyParser2.default.json());
            this.express.use(_bodyParser2.default.urlencoded({
                extended: true
            }));
        }
    }, {
        key: 'routes',
        value: function routes() {
            this.express.use('/', _express2.default.static(_path2.default.join(__dirname, '../../', '/swagger')));
            this.express.use('/hello', this.helloRoute.router);
            this.express.use('/authentication', this.authenticationRoute.router);
            this.express.use('/pokemon', this.pokemonRoute.router);
            this.express.use('/properties', this.propertiesRoute.router);
            this.express.use('/pokemon-type', this.pokemonTypeRoute.router);
            this.express.use('/pokemon-weakness', this.pokemonWeaknessRoute.router);
            this.express.use('/pokemon-ability', this.pokemonAbilityRoute.router);
            this.express.use('/pokemon-image', this.pokemonImageRoute.router);
            this.express.use('/users', this.userRoute.router);
        }
    }]);

    return AppRoute;
}();

;

exports.default = AppRoute;
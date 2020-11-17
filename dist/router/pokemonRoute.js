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

var _pokemonCore = require('../core/pokemonCore');

var _pokemonCore2 = _interopRequireDefault(_pokemonCore);

var _pokemonTypeCore = require('../core/pokemonTypeCore');

var _pokemonTypeCore2 = _interopRequireDefault(_pokemonTypeCore);

var _pokemonWeaknessCore = require('../core/pokemonWeaknessCore');

var _pokemonWeaknessCore2 = _interopRequireDefault(_pokemonWeaknessCore);

var _pokemonAbilityCore = require('../core/pokemonAbilityCore');

var _pokemonAbilityCore2 = _interopRequireDefault(_pokemonAbilityCore);

var _pokemonImageCore = require('../core/pokemonImageCore');

var _pokemonImageCore2 = _interopRequireDefault(_pokemonImageCore);

var _propertiesCore = require('../core/propertiesCore');

var _propertiesCore2 = _interopRequireDefault(_propertiesCore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PokemonRoute = function () {
    function PokemonRoute() {
        _classCallCheck(this, PokemonRoute);

        this.redisCore = new _redisCore2.default();
        this.userCore = new _userCore2.default();
        this.pokemonCore = new _pokemonCore2.default();
        this.pokemonTypeCore = new _pokemonTypeCore2.default();
        this.pokemonWeaknessCore = new _pokemonWeaknessCore2.default();
        this.pokemonAbilityCore = new _pokemonAbilityCore2.default();
        this.pokemonImageCore = new _pokemonImageCore2.default();
        this.propertiesCore = new _propertiesCore2.default();

        this.router = _express2.default.Router();
        this.routes();
    }

    _createClass(PokemonRoute, [{
        key: 'list',
        value: function list(req, res, next) {
            var _this = this;

            var _Joi$validate = _joi2.default.validate(req.query, _joi2.default.object().keys({
                id: _joi2.default.number().integer().min(1),
                name: _joi2.default.string(),
                tag: _joi2.default.number().integer().min(1),
                type_id: _joi2.default.number().integer().min(1),
                weakness_id: _joi2.default.number().integer().min(1),
                ability_id: _joi2.default.number().integer().min(1),
                descending_by_id: _joi2.default.boolean(),
                page: _joi2.default.number().positive().not(0).default(1),
                limit: _joi2.default.number().positive().not(0).max(500).default(10)
            }).unknown()),
                paramError = _Joi$validate.error,
                paramValues = _Joi$validate.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

            var returnData = void 0;
            var total = void 0;

            this.pokemonCore.get({
                id: paramValues.id,
                name: paramValues.name,
                tag: paramValues.tag,
                type_id: paramValues.type_id,
                weakness_id: paramValues.weakness_id,
                ability_id: paramValues.ability_id,
                descending_by_id: paramValues.descending_by_id,
                page: paramValues.page,
                limit: paramValues.limit
            }).then(function (result) {
                returnData = result;
                return Promise.all(returnData.map(function (data) {
                    return Promise.all([_this.pokemonCore.get({
                        id: data.of_basic
                    }), _this.pokemonAbilityCore.get({
                        pokemon_id: data.id
                    })]);
                }));
            }).then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    returnData[i].of_basic = result[i][0].map(function (a) {
                        return {
                            id: a.id,
                            name: a.name
                        };
                    })[0];
                    returnData[i].abilities = result[i][1].map(function (ability) {
                        return {
                            id: ability.ability_id,
                            name: ability.ability_name,
                            description: ability.ability_description
                        };
                    });
                }
            }).then(function (result) {
                return _this.pokemonCore.countTotal({});
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
        key: 'create',
        value: function create(req, res, next) {
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
                    name: _joi2.default.string().regex(/[a-zA-Z]/).required(),
                    stage: _joi2.default.number().integer().valid(0, 1, 2, 3).required(),
                    of_basic: _joi2.default.number().integer(),
                    height: _joi2.default.number().integer().positive(),
                    weight: _joi2.default.number().positive().precision(2),
                    gender: _joi2.default.number().integer().valid(1, 2, 3),
                    types: _joi2.default.array().items(_joi2.default.number().integer()),
                    weakness: _joi2.default.array().items(_joi2.default.number().integer()),
                    abilities: _joi2.default.array().items(_joi2.default.number().integer())
                }).unknown()
            }),
                paramError = _Joi$validate2.error,
                paramValues = _Joi$validate2.value;

            if (paramError) {
                return res.status(400).json(_errorParser2.default.handleJoiError(paramError));
            }

            var returnData = void 0;

            var params = {
                name: paramValues.value.name,
                stage: paramValues.value.stage,
                height: paramValues.value.height,
                weight: paramValues.value.weight,
                gender: paramValues.value.gender ? paramValues.value.gender : dataConstant.GENDER_BOTH
            };

            var getTypeData = void 0;
            var setTypeData = paramValues.value.types || [];
            var typeDifferents = [];

            var getWeaknessData = void 0;
            var setWeaknessData = paramValues.value.weakness || [];
            var weaknessDifferents = [];

            var getAbilityData = void 0;
            var setAbilityData = paramValues.value.abilities || [];
            var abilityDifferents = [];

            var lastId = void 0;

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

                return _this2.pokemonCore.getByName({
                    name: paramValues.value.name
                });
            }).then(function (result) {
                if (result.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_DATA_EXISTS,
                            error: 'Pokemon\'s name ' + paramValues.value.name + ' was taken.'
                        });
                    });
                }

                return Promise.all([_this2.propertiesCore.getType({}), _this2.propertiesCore.getWeakness({}), _this2.propertiesCore.getAbility({})]);
            }).then(function (result) {
                getTypeData = result[0].map(function (type) {
                    return type.id;
                });
                getWeaknessData = result[1].map(function (weakness) {
                    return weakness.id;
                });
                getAbilityData = result[2].map(function (ability) {
                    return ability.id;
                });

                typeDifferents = setTypeData.filter(function (a) {
                    return !getTypeData.includes(a);
                });
                weaknessDifferents = setWeaknessData.filter(function (a) {
                    return !getWeaknessData.includes(a);
                });
                abilityDifferents = setAbilityData.filter(function (a) {
                    return !getAbilityData.includes(a);
                });

                if (typeDifferents.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_MYSQL,
                            error: 'types = [' + typeDifferents + '] not exists'
                        });
                    });
                };

                if (weaknessDifferents.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_MYSQL,
                            error: 'weakness = [' + weaknessDifferents + '] not exists'
                        });
                    });
                };

                if (abilityDifferents.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_MYSQL,
                            error: 'abilities = [' + abilityDifferents + '] not exists'
                        });
                    });
                };

                return _this2.pokemonCore.getLastId();
            }).then(function (result) {
                lastId = result.length ? result[0].id : 0;
                if (params.stage !== dataConstant.STAGE_BASIC) {
                    if (!paramValues.value.of_basic) {
                        return new Promise(function (resolve, reject) {
                            return reject({
                                code: responseCode.ERROR,
                                error: 'of_basic cannot be empty if stage = ' + params.stage
                            });
                        });
                    }
                    return new Promise(function (resolve, reject) {
                        _this2.pokemonCore.get({
                            id: paramValues.value.of_basic
                        }).then(function (result) {
                            if (!result.length) {
                                return new Promise(function (resolve, reject) {
                                    return reject({
                                        code: responseCode.ERR_DATA_NOT_FOUND,
                                        error: 'Pokemon of_basic \'' + paramValues.value.of_basic + '\' not found'
                                    });
                                });
                            }

                            if (result.length && result[0].stage !== dataConstant.STAGE_BASIC) {
                                return new Promise(function (resolve, reject) {
                                    return reject({
                                        code: responseCode.ERR_DATA_NOT_FOUND,
                                        error: 'of_basic \'' + result[0].id + ' - ' + result[0].name + '\' given is not basic pokemon'
                                    });
                                });
                            }

                            params.tag = result[0].tag;
                            params.of_basic = result[0].id;
                            resolve(result);
                        }).catch(function (error) {
                            reject(error);
                        });
                    });
                }

                params.of_basic = lastId + 1;
                params.tag = lastId + 1;
                return result;
            }).then(function (result) {
                return new Promise(function (resolve, reject) {
                    _this2.pokemonCore.create(params).then(function (result) {
                        return Promise.all([Promise.all(setTypeData.map(function (type_id) {
                            return _this2.pokemonTypeCore.set({
                                pokemon_id: lastId + 1,
                                type_id: type_id
                            });
                        })), Promise.all(setWeaknessData.map(function (weakness_id) {
                            return _this2.pokemonWeaknessCore.set({
                                pokemon_id: lastId + 1,
                                weakness_id: weakness_id
                            });
                        })), Promise.all(setAbilityData.map(function (ability_id) {
                            return _this2.pokemonAbilityCore.set({
                                pokemon_id: lastId + 1,
                                ability_id: ability_id
                            });
                        }))]);
                    }).then(function (result) {
                        resolve(result);
                    }).catch(function (err) {
                        reject(err);
                    });
                });
            }).then(function (result) {
                return _this2.pokemonCore.get({
                    id: lastId + 1
                });
            }).then(function (result) {
                returnData = result;
                return Promise.all(returnData.map(function (data) {
                    return Promise.all([_this2.pokemonCore.get({
                        id: data.of_basic
                    }), _this2.pokemonAbilityCore.get({
                        pokemon_id: data.id
                    })]);
                }));
            }).then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    returnData[i].of_basic = result[i][0].map(function (a) {
                        return {
                            id: a.id,
                            name: a.name
                        };
                    })[0];
                    returnData[i].abilities = result[i][1].map(function (ability) {
                        return {
                            id: ability.ability_id,
                            name: ability.ability_name,
                            description: ability.ability_description
                        };
                    });
                }
            }).then(function (result) {
                return res.status(200).json({
                    code: responseCode.SUCCESS,
                    data: returnData
                });
            }).catch(function (error) {
                console.log(error);
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
                    id: _joi2.default.number().integer().required(),
                    name: _joi2.default.string().regex(/[a-zA-Z]/),
                    stage: _joi2.default.number().integer().valid(0, 1, 2, 3),
                    of_basic: _joi2.default.number().integer(),
                    height: _joi2.default.number().integer().positive(),
                    weight: _joi2.default.number().positive().precision(2),
                    gender: _joi2.default.number().integer().valid(1, 2, 3),
                    status: _joi2.default.number().integer().valid(1, 2)
                }).unknown()
            }),
                paramError = _Joi$validate3.error,
                paramValues = _Joi$validate3.value;

            var returnData = void 0;
            var values = {};

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

                return _this3.pokemonCore.get({
                    id: paramValues.value.id
                });
            }).then(function (result) {
                var pokemonNeedUpdate = result;
                if (!pokemonNeedUpdate.length) {
                    return new Promise(function (resolve, reject) {
                        return reject({
                            code: responseCode.ERR_DATA_NOT_FOUND,
                            error: 'Pokemon with id = ' + paramValues.id + ' is not found'
                        });
                    });
                };
                if (paramValues.value.weight) {
                    values.weight = paramValues.value.weight;
                };
                if (paramValues.value.height) {
                    values.height = paramValues.value.height;
                };
                if (paramValues.value.gender) {
                    values.gender = paramValues.value.gender;
                };
                if (paramValues.value.status) {
                    values.status = paramValues.value.status;
                };
                if (paramValues.value.stage !== null) {
                    if (paramValues.value.stage === dataConstant.STAGE_BASIC) {
                        values.stage = paramValues.value.stage;
                        values.of_basic = paramValues.value.id;
                        values.tag = paramValues.value.id;
                    }
                    if (paramValues.value.stage !== dataConstant.STAGE_BASIC) {
                        if (!paramValues.value.of_basic) {
                            return new Promise(function (resolve, reject) {
                                return reject({
                                    code: responseCode.ERROR,
                                    error: 'of_basic cannot be empty if stage = ' + paramValues.value.stage
                                });
                            });
                        };
                        return new Promise(function (resolve, reject) {
                            _this3.pokemonCore.get({
                                id: paramValues.value.of_basic
                            }).then(function (result) {
                                if (!result.length) {
                                    return new Promise(function (resolve, reject) {
                                        return reject({
                                            code: responseCode.ERR_DATA_NOT_FOUND,
                                            error: 'Pokemon of_basic \'' + paramValues.value.of_basic + '\' not found'
                                        });
                                    });
                                }

                                if (result.length && result[0].stage !== dataConstant.STAGE_BASIC) {
                                    return new Promise(function (resolve, reject) {
                                        return reject({
                                            code: responseCode.ERR_DATA_NOT_FOUND,
                                            error: 'of_basic \'' + paramValues.value.of_basic + '\' given is not basic pokemon'
                                        });
                                    });
                                }
                                values.stage = paramValues.value.stage;
                                values.of_basic = paramValues.value.of_basic;
                                values.tag = paramValues.value.of_basic;
                                resolve(result);
                            }).catch(function (error) {
                                reject(error);
                            });
                        });
                    };
                };
                if (paramValues.value.name && paramValues.value.name !== pokemonNeedUpdate[0].name) {
                    return new Promise(function (resolve, reject) {
                        _this3.pokemonCore.getByName({
                            name: paramValues.value.name
                        }).then(function (result) {
                            if (result.length && result[0].id !== paramValues.value.id) {
                                return new Promise(function (resolve, reject) {
                                    return reject({
                                        code: responseCode.ERROR,
                                        error: 'Pokemon\'s name ' + paramValues.value.name + ' was taken.'
                                    });
                                });
                            }
                            values.name = paramValues.value.name;
                            resolve(result);
                        }).catch(function (error) {
                            reject(error);
                        });
                    });
                };
            }).then(function (result) {
                return new Promise(function (resolve, reject) {
                    _this3.pokemonCore.update({
                        id: paramValues.value.id,
                        values: values
                    }).then(function (result) {
                        resolve(result);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }).then(function (result) {
                return new Promise(function (resolve, reject) {
                    _this3.pokemonCore.get({
                        id: paramValues.value.id
                    }).then(function (result) {
                        resolve(result);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }).then(function (result) {
                returnData = result[0];
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
            this.router.post('/create', this.create.bind(this));
            this.router.put('/update', this.update.bind(this));
        }
    }]);

    return PokemonRoute;
}();

;

exports.default = PokemonRoute;
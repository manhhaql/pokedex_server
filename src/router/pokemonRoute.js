import Express from 'express';
import Joi from 'joi';

import ErrorParser from '../helper/errorParser';
import * as responseCode from '../constant/responseCode';
import * as dataConstant from '../constant/data';

import RedisCore from '../core/redis/redisCore';
import UserCore from '../core/userCore';
import PokemonCore from '../core/pokemonCore';
import PokemonTypeCore from '../core/pokemonTypeCore';
import PokemonWeaknessCore from '../core/pokemonWeaknessCore';
import PokemonAbilityCore from '../core/pokemonAbilityCore';
import PokemonImageCore from '../core/pokemonImageCore';
import PropertiesCore from '../core/propertiesCore';

class PokemonRoute {
    constructor() {
        this.redisCore = new RedisCore();
        this.userCore = new UserCore();
        this.pokemonCore = new PokemonCore();
        this.pokemonTypeCore = new PokemonTypeCore();
        this.pokemonWeaknessCore = new PokemonWeaknessCore();
        this.pokemonAbilityCore = new PokemonAbilityCore();
        this.pokemonImageCore = new PokemonImageCore();
        this.propertiesCore = new PropertiesCore();

        this.router = Express.Router();
        this.routes();
    };

    list(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.query, Joi.object().keys({
            id: Joi.number().integer().min(1),
            name: Joi.string(),
            type_id: Joi.number().integer().min(1),
            weakness_id: Joi.number().integer().min(1),
            ability_id: Joi.number().integer().min(1),
            descending_by_id: Joi.boolean(),
            page: Joi.number().positive().not(0).default(1),
            limit: Joi.number().positive().not(0).max(500).default(10)
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        let returnData;
        let total;

        this.pokemonCore.get({
            id: paramValues.id,
            name: paramValues.name,
            type_id: paramValues.type_id,
            weakness_id: paramValues.weakness_id,
            ability_id: paramValues.ability_id,
            descending_by_id: paramValues.descending_by_id,
            page: paramValues.page,
            limit: paramValues.limit
        }).then((result) => {
            returnData = result
            return Promise.all(returnData.map((data) => {
                return Promise.all([
                    this.pokemonCore.get({
                        id: data.of_basic
                    }),
                    this.pokemonAbilityCore.get({
                        pokemon_id: data.id
                    })
                ])
            }))
        }).then((result) => {
            for(let i=0;i<result.length;i++) {
                returnData[i].of_basic = result[i][0].map((a=>{
                    return {
                        id: a.id,
                        name: a.name,
                    }
                }))[0]
                returnData[i].abilities = result[i][1].map((ability) => {
                    return {
                        id: ability.ability_id,
                        name: ability.ability_name,
                        description: ability.ability_description,
                    }
                })
            }
        }).then((result) => {
            return this.pokemonCore.countTotal({})
        }).then((result) => {
            total = result[0].total
        }).then((result) => {
            return res.status(200).json({
                code: responseCode.SUCCESS,
                total: total,
                data: returnData
            })
        }).catch((error) => {
            return res.status(400).json(error)
        })
    };

    create(req, res, next) {
        const authorizationToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : '';

        if(!authorizationToken) {
            return  res.status(400).json(ErrorParser.handleAuthenticationError("Authorization token is missing"))
        }

        const {error: paramError, value: paramValues} = Joi.validate(
            {
                token: authorizationToken,
                value: req.body
                
            }, 
            {
                token: Joi.string().required(),
                value: Joi.object().keys(
                    {
                        name: Joi.string().regex(/[a-zA-Z]/).required(),
                        stage: Joi.number().integer().valid(0, 1, 2, 3).required(),
                        of_basic: Joi.number().integer(),
                        height: Joi.number().integer().positive(),
                        weight: Joi.number().positive().precision(2),
                        gender: Joi.number().integer().valid(1, 2, 3),
                        types: Joi.array().items(Joi.number().integer()),
                        weakness: Joi.array().items(Joi.number().integer()),
                        abilities: Joi.array().items(Joi.number().integer())
                    }
                ).unknown()
            }
        );

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }
        
        let returnData;

        let params = {
            name: paramValues.value.name,
            stage: paramValues.value.stage,
            height: paramValues.value.height,
            weight: paramValues.value.weight,
            gender: paramValues.value.gender ? paramValues.value.gender : dataConstant.GENDER_BOTH
        };

        let getTypeData;
        let setTypeData = paramValues.value.types || [];
        let typeDifferents = [];

        let getWeaknessData;
        let setWeaknessData = paramValues.value.weakness || [];
        let weaknessDifferents = [];

        let getAbilityData;
        let setAbilityData = paramValues.value.abilities || [];
        let abilityDifferents = [];

        let lastId;

        this.redisCore.getRedisToken({
            token: paramValues.token
        }).then(result => {
            if(!result) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_TOKEN_NOT_FOUND,
                        error: 'Token not found'
                    })
                })
            }
            return this.userCore.getBy({
                id: result.user.id
            })
        }).then(result => {
            if(result[0].status !== dataConstant.STATUS_ACTIVE) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_STATUS_INACTIVE,
                        error: "User is inactive"
                    })
                })
            }

            if(result[0].type !== (dataConstant.USER_ADMIN)) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_PERMISSION_REQUIRED,
                        error: "You are not admin"
                    })
                })
            }

            return this.pokemonCore.getByName({
                name: paramValues.value.name
            })
        }).then(result => {
            if(result.length) {
                return new Promise((resolve, reject)=>{
                    return reject ({
                        code: responseCode.ERR_DATA_EXISTS,
                        error: `Pokemon's name ${paramValues.value.name} was taken.`
                    })
                })
            }
            
            return Promise.all([
                this.propertiesCore.getType({}),
                this.propertiesCore.getWeakness({}),
                this.propertiesCore.getAbility({})
            ])
        }).then(result=>{
            getTypeData = result[0].map(type=>type.id);
            getWeaknessData = result[1].map(weakness=>weakness.id);
            getAbilityData = result[2].map(ability=>ability.id);

            typeDifferents = setTypeData.filter(a => !getTypeData.includes(a));
            weaknessDifferents = setWeaknessData.filter(a=> !getWeaknessData.includes(a));
            abilityDifferents = setAbilityData.filter(a=> !getAbilityData.includes(a));

            if(typeDifferents.length) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_MYSQL,
                        error: `types = [${typeDifferents}] not exists`
                    })
                })
            };

            if(weaknessDifferents.length) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_MYSQL,
                        error: `weakness = [${weaknessDifferents}] not exists`
                    })
                })
            };

            if(abilityDifferents.length) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_MYSQL,
                        error: `abilities = [${abilityDifferents}] not exists`
                    })
                })
            };

            return this.pokemonCore.getLastId();
        }).then(result => {
            lastId = result.length ? result[0].id : 0
            if(params.stage !== dataConstant.STAGE_BASIC) {
                if(!paramValues.value.of_basic) {
                    return new Promise((resolve, reject) => {
                        return reject({
                            code: responseCode.ERROR,
                            error: `of_basic cannot be empty if stage = ${params.stage}`
                        })
                    })
                }
                return new Promise((resolve, reject) => {
                    this.pokemonCore.get({
                        id: paramValues.value.of_basic
                    }).then(result => {
                        if(!result.length) {
                            return new Promise((resolve, reject) => {
                                return reject({
                                    code: responseCode.ERR_DATA_NOT_FOUND,
                                    error: `Pokemon of_basic '${paramValues.value.of_basic}' not found`
                                })
    
                            })
                        }
    
                        if(result.length && result[0].stage !== dataConstant.STAGE_BASIC) {
                            return new Promise((resolve, reject) => {
                                return reject({
                                    code: responseCode.ERR_DATA_NOT_FOUND,
                                    error: `of_basic '${result[0].id} - ${result[0].name}' given is not basic pokemon`
                                })
                            })
                        }
    
                        params.tag = result[0].tag
                        params.of_basic = result[0].id
                        resolve(result)
                    }).catch(error => {
                        reject(error)
                    })
                })
            }

            params.of_basic = lastId + 1
            params.tag = lastId + 1
            return result
        }).then(result => {
            return new Promise((resolve, reject) => {
                this.pokemonCore.create(params)
                .then(result => {
                    return Promise.all([
                        Promise.all(setTypeData.map((type_id)=>{
                            return this.pokemonTypeCore.set({
                                pokemon_id: lastId + 1,
                                type_id: type_id
                            })
                        })),
                        Promise.all(setWeaknessData.map((weakness_id)=>{
                            return this.pokemonWeaknessCore.set({
                                pokemon_id: lastId + 1,
                                weakness_id: weakness_id
                            })
                        })),
                        Promise.all(setAbilityData.map((ability_id)=>{
                            return this.pokemonAbilityCore.set({
                                pokemon_id: lastId + 1,
                                ability_id: ability_id
                            })
                        }))
                    ])
                }).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        }).then(result => {
            return this.pokemonCore.get({
                id: lastId + 1
            })
        }).then((result) => {
            returnData = result
            return Promise.all(returnData.map((data) => {
                return Promise.all([
                    this.pokemonCore.get({
                        id: data.of_basic
                    }),
                    this.pokemonAbilityCore.get({
                        pokemon_id: data.id
                    })
                ])
            }))
        }).then((result) => {
            for(let i=0;i<result.length;i++) {
                returnData[i].of_basic = result[i][0].map((a=>{
                    return {
                        id: a.id,
                        name: a.name,
                    }
                }))[0]
                returnData[i].abilities = result[i][1].map((ability) => {
                    return {
                        id: ability.ability_id,
                        name: ability.ability_name,
                        description: ability.ability_description,
                    }
                })
            }
        }).then(result=>{
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: returnData
            })
        }).catch(error=>{
            console.log(error)
            return res.status(400).json(error)
        })
    };

    update(req, res, next) {
        const authorizationToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : '';

        if(!authorizationToken) {
            return  res.status(400).json(ErrorParser.handleAuthenticationError("Authorization token is missing"))
        }

        const {error: paramError, value: paramValues} = Joi.validate(
            {
                token: authorizationToken,
                value: req.body
                
            }, 
            {
                token: Joi.string().required(),
                value: Joi.object().keys(
                    {
                        id: Joi.number().integer().required(),
                        name: Joi.string().regex(/[a-zA-Z]/),
                        stage: Joi.number().integer().valid(0, 1, 2, 3),
                        of_basic: Joi.number().integer(),
                        height: Joi.number().integer().positive(),
                        weight: Joi.number().positive().precision(2),
                        gender: Joi.number().integer().valid(1, 2, 3),
                        status: Joi.number().integer().valid(1, 2),
                    }
                ).unknown()
            }
        );
        
        let returnData;
        let values= {};

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }
        
        this.redisCore.getRedisToken({
            token: paramValues.token
        }).then(result => {
            if(!result) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_TOKEN_NOT_FOUND,
                        error: 'Token not found'
                    })
                })
            }
            return this.userCore.getBy({
                id: result.user.id
            })
        }).then(result => {
            if(result[0].status !== dataConstant.STATUS_ACTIVE) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_STATUS_INACTIVE,
                        error: "User is inactive"
                    })
                })
            }

            if(result[0].type !== (dataConstant.USER_ADMIN)) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_PERMISSION_REQUIRED,
                        error: "You are not admin"
                    })
                })
            }

            return this.pokemonCore.get({
                id: paramValues.value.id
            })
        }).then(result => {
            let pokemonNeedUpdate = result;
            if(!pokemonNeedUpdate.length) {
                return new Promise((resolve, reject)=>{
                    return reject({
                        code: responseCode.ERR_DATA_NOT_FOUND,
                        error: `Pokemon with id = ${paramValues.id} is not found`
                    })
                })
            };
            if(paramValues.value.weight) {
                values.weight = paramValues.value.weight
            };
            if(paramValues.value.height) {
                values.height = paramValues.value.height
            };
            if(paramValues.value.gender) {
                values.gender = paramValues.value.gender
            };
            if(paramValues.value.status) {
                values.status = paramValues.value.status
            };
            if(paramValues.value.stage !== null) {
                if(paramValues.value.stage === dataConstant.STAGE_BASIC) {
                    values.stage = paramValues.value.stage
                    values.of_basic = paramValues.value.id
                    values.tag = paramValues.value.id
                }
                if(paramValues.value.stage !== dataConstant.STAGE_BASIC) {
                    if(!paramValues.value.of_basic) {
                        return new Promise((resolve, reject) => {
                            return reject({
                                code: responseCode.ERROR,
                                error: `of_basic cannot be empty if stage = ${paramValues.value.stage}`
                            })
                        })
                    };
                    return new Promise((resolve, reject)=>{
                        this.pokemonCore.get({
                            id: paramValues.value.of_basic
                        }).then(result=>{
                            if(!result.length) {
                                return new Promise((resolve, reject) => {
                                    return reject({
                                        code: responseCode.ERR_DATA_NOT_FOUND,
                                        error: `Pokemon of_basic '${paramValues.value.of_basic}' not found`
                                    })
                                })
                            }
        
                            if(result.length && result[0].stage !== dataConstant.STAGE_BASIC) {
                                return new Promise((resolve, reject) => {
                                    return reject({
                                        code: responseCode.ERR_DATA_NOT_FOUND,
                                        error: `of_basic '${paramValues.value.of_basic}' given is not basic pokemon`
                                    })
                                })
                            }
                            values.stage = paramValues.value.stage;
                            values.of_basic = paramValues.value.of_basic;
                            values.tag = paramValues.value.of_basic;
                            resolve(result)
                        }).catch(error=>{
                            reject(error)
                        })
                    })
                };
            };
            if(paramValues.value.name && paramValues.value.name !== pokemonNeedUpdate[0].name) {
                return new Promise((resolve, reject)=>{
                    this.pokemonCore.getByName({
                        name: paramValues.value.name
                    }).then(result=>{
                        if(result.length && result[0].id !== paramValues.value.id) {
                            return new Promise((resolve, reject)=>{
                                return reject ({
                                    code: responseCode.ERROR,
                                    error: `Pokemon's name ${paramValues.value.name} was taken.`
                                })
                            })
                        }
                        values.name = paramValues.value.name;
                        resolve(result);
                    }).catch(error=>{
                        reject(error)
                    })
                })
            };
        }).then(result=>{
            return new Promise((resolve, reject) => {
                this.pokemonCore.update({
                    id: paramValues.value.id,
                    values: values
                }).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        }).then(result=>{
            return new Promise((resolve, reject) => {
                this.pokemonCore.get({
                    id: paramValues.value.id
                }).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        }).then(result=>{
            returnData = result[0]
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: returnData
            })
        }).catch(error=>{
            return res.status(400).json(error)
        })
    };

    routes() {
        this.router.get('/list', this.list.bind(this));
        this.router.post('/create', this.create.bind(this));
        this.router.put('/update', this.update.bind(this));
    };
};

export default PokemonRoute;
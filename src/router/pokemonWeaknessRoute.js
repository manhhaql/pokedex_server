import Express from 'express';
import Joi from 'joi';

import ErrorParser from '../helper/errorParser';
import * as responseCode from '../constant/responseCode';
import * as dataConstant from '../constant/data';

import RedisCore from '../core/redis/redisCore';
import UserCore from '../core/userCore';
import PokemonWeaknessCore from '../core/pokemonWeaknessCore';
import PropertiesCore from '../core/propertiesCore';

class PokemonWeaknessRoute {
    constructor() {
        this.redisCore = new RedisCore();
        this.userCore = new UserCore();
        this.pokemonWeaknessCore = new PokemonWeaknessCore();
        this.propertiesCore = new PropertiesCore();

        this.router = Express.Router();
        this.routes();
    };

    list(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.query, Joi.object().keys({
            weakness_id: Joi.number().integer().min(1),
            pokemon_id: Joi.number().integer().min(1),
            page: Joi.number().positive().not(0).default(1),
            limit: Joi.number().positive().not(0).max(500).default(10)
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        this.pokemonWeaknessCore.get({
            weakness_id: paramValues.weakness_id,
            pokemon_id: paramValues.pokemon_id,
            page: paramValues.page,
            limit: paramValues.limit
        }).then((result) => {
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: result
            })
        }).catch((error) => {
            return res.status(400).json(error)
        })
    };

    set(req, res, next) {
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
                        pokemon_id: Joi.number().integer().min(1).required(),
                        weakness: Joi.array().items(Joi.number().integer())
                    }
                ).unknown()
            }
        );
        
        let returnData;
        let weaknessData;
        let setWeaknessData = paramValues.value.weakness;
        let differents = [];

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

            if(result[0].type !== dataConstant.USER_ADMIN) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_PERMISSION_REQUIRED,
                        error: "You are not admin"
                    })
                })
            }
            return this.propertiesCore.getWeakness({})
        }).then(result => {
            weaknessData = result.map((weakness) => {
                return weakness.id
            });
            differents = setWeaknessData.filter((a) => !weaknessData.includes(a))
            if(differents.length) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_MYSQL,
                        error: `weakness = [${differents}] not exists`
                    })
                })
            }
        }).then(result => {
            return this.pokemonWeaknessCore.delete({
                pokemon_id: paramValues.value.pokemon_id
            })
        }).then(results => {
            return Promise.all(paramValues.value.weakness.map((weakness_id)=>{
                return new Promise((resolve, reject)=>{
                    this.pokemonWeaknessCore.set({
                        pokemon_id: paramValues.value.pokemon_id,
                        weakness_id: weakness_id
                    }).then((result)=>{
                        resolve(result)
                    }).catch((error)=>{
                        reject(error)
                    })
                })
            }))
        }).then(result=>{
            return new Promise((resolve, reject) => {
                this.pokemonWeaknessCore.get({
                    pokemon_id: paramValues.value.pokemon_id
                }).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        }).then(result=>{
            returnData = result
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
        this.router.post('/set', this.set.bind(this));
    };
};

export default PokemonWeaknessRoute;
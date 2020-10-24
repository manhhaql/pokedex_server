import Express from 'express';
import Joi from 'joi';

import ErrorParser from '../helper/errorParser';
import * as responseCode from '../constant/responseCode';
import * as dataConstant from '../constant/data';

import RedisCore from '../core/redis/redisCore';
import UserCore from '../core/userCore';
import PokemonAbilityCore from '../core/pokemonAbilityCore';
import PropertiesCore from '../core/propertiesCore';

class PokemonAbilityRoute {
    constructor() {
        this.redisCore = new RedisCore();
        this.userCore = new UserCore();
        this.pokemonAbilityCore = new PokemonAbilityCore();
        this.propertiesCore = new PropertiesCore();

        this.router = Express.Router();
        this.routes();
    };

    list(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.query, Joi.object().keys({
            ability_id: Joi.number().integer().min(1),
            pokemon_id: Joi.number().integer().min(1),
            page: Joi.number().positive().not(0).default(1),
            limit: Joi.number().positive().not(0).max(500).default(10)
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        this.pokemonAbilityCore.get({
            ability_id: paramValues.ability_id,
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
        const {error: paramError, value: paramValues} = Joi.validate(req.body, Joi.object().keys({
            token: Joi.string().required(),
            pokemon_id: Joi.number().integer().min(1).required(),
            abilities: Joi.array().items(Joi.number().integer())
        }).unknown());
        
        let returnData;
        let abilityData;
        let setAbilityData = paramValues.abilities;
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

            return this.propertiesCore.getAbility({})
        }).then(result => {
            abilityData = result.map((ability) => {
                return ability.id
            });

            differents = setAbilityData.filter((a) => !abilityData.includes(a))

            if(differents.length) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_MYSQL,
                        error: `abilities = [${differents}] not exists`
                    })
                })
            }
        }).then(result => {
            return this.pokemonAbilityCore.delete({
                pokemon_id: paramValues.pokemon_id
            })
        }).then(results => {
            return Promise.all(paramValues.abilities.map((ability_id)=>{
                return new Promise((resolve, reject)=>{
                    this.pokemonAbilityCore.set({
                        pokemon_id: paramValues.pokemon_id,
                        ability_id: ability_id
                    }).then((result)=>{
                        resolve(result)
                    }).catch((error)=>{
                        reject(error)
                    })
                })
            }))
        }).then(result=>{
            return new Promise((resolve, reject) => {
                this.pokemonAbilityCore.get({
                    pokemon_id: paramValues.pokemon_id
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
            console.log(error)
            return res.status(400).json(error)
        })
    };

    routes() {
        this.router.get('/list', this.list.bind(this));
        this.router.post('/set', this.set.bind(this));
    };
};

export default PokemonAbilityRoute;
import Express from 'express';
import Joi from 'joi';

import ErrorParser from '../helper/errorParser';
import * as responseCode from '../constant/responseCode';
import * as dataConstant from '../constant/data';

import RedisCore from '../core/redis/redisCore';
import UserCore from '../core/userCore';

class UserRoute {
    constructor() {
        this.redisCore = new RedisCore();
        this.userCore = new UserCore();

        this.router = Express.Router();
        this.routes();
    };

    userInfo(req, res, next) {
        const authorizationToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : '';
        
        if(!authorizationToken) {
            return  res.status(400).json(ErrorParser.handleAuthenticationError("Authorization token is missing"))
        }

        const {error: paramError, value: paramValues} = Joi.validate(
            {
                token: authorizationToken
            }, 
            {
                token: Joi.string().required()
            }
        );
        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }
        let responseData = {};

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

            responseData.token = result.token;

            return this.userCore.getBy({
                user_id: result.user.id
            })
        }).then((result) => {
            if(!result.length) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_DATA_NOT_FOUND,
                        error: 'User not found'
                    })
                })
            }
            responseData.user = result[0]
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: responseData
            })
        }).catch((error) => {
            console.log(error)
            return res.status(400).json(error)
        })
    };

    // update(req, res, next) {
    //     const {error: paramError, value: paramValues} = Joi.validate(req.body, Joi.object().keys({
    //         token: Joi.string().required(),
    //         id: Joi.number().integer().required(),
    //         name: Joi.string().regex(/^[a-zA-Z]([\w - ]*[a-zA-Z0-9])?$/),
    //         gender: Joi.number().integer().valid(1, 2, 9),
    //         status: Joi.number().integer().valid(0, 1)
    //     }).unknown());
        
    //     let returnData;
    //     let values= {};

    //     if(paramError) {
    //         return res.status(400).json(ErrorParser.handleJoiError(paramError))
    //     }
        
    //     this.redisCore.getRedisToken({
    //         token: paramValues.token
    //     }).then(result => {
    //         if(!result) {
    //             return new Promise((resolve, reject) => {
    //                 return reject({
    //                     code: responseCode.ERR_TOKEN_NOT_FOUND,
    //                     error: 'Token not found'
    //                 })
    //             })
    //         }
    //         return this.userCore.getBy({
    //             id: result.user.id
    //         })
    //     }).then(result => {
    //         if(result[0].status !== dataConstant.STATUS_ACTIVE) {
    //             return new Promise((resolve, reject) => {
    //                 return reject({
    //                     code: responseCode.ERR_STATUS_INACTIVE,
    //                     error: "User is inactive"
    //                 })
    //             })
    //         }

    //         if(result[0].type !== (dataConstant.USER_ROOT && dataConstant.USER_ADMIN)) {
    //             return new Promise((resolve, reject) => {
    //                 return reject({
    //                     code: responseCode.ERR_PERMISSION_REQUIRED,
    //                     error: "You don't have permission to update product"
    //                 })
    //             })
    //         }
    //         return this.productCore.get({
    //             id: paramValues.id
    //         })
    //     }).then(result => {
    //         if(!result.length) {
    //             return new Promise((resolve, reject)=>{
    //                 return reject({
    //                     code: responseCode.ERR_DATA_NOT_FOUND,
    //                     error: `Product with id = ${paramValues.id} is not exists`
    //                 })
    //             })
    //         }
    //         values.status = paramValues.status ? paramValues.status : result[0].status
    //         values.gender = paramValues.gender ? paramValues.gender : result[0].gender

    //         if(paramValues.name) {
    //             values.name = paramValues.name;
    //             if(paramValues.name.includes('  ')) {
    //                 return res.status(400).json({
    //                     code: responseCode.ERR_VALIDATION,
    //                         error: `Product name can't contain duplicate space`
    //                 })
    //             }
    //             return new Promise((resolve, reject)=>{
    //                 this.productCore.getByName({
    //                     name: paramValues.name
    //                 }).then(result=>{
    //                     if(result.length && result[0].id !== paramValues.id) {
    //                         return new Promise((resolve, reject)=>{
    //                             return reject ({
    //                                 code: responseCode.ERROR,
    //                                 error: `Product with name = ${paramValues.name} has applied to another product`
    //                             })
    //                         })
    //                     }
    //                     resolve(result)
    //                 }).catch(error=>{
    //                     reject(error)
    //                 })
    //             })
    //         }
            
    //     }).then(result=>{
    //         return new Promise((resolve, reject) => {
    //             this.productCore.update({
    //                 id: paramValues.id,
    //                 values: values
    //             }).then(result => {
    //                 resolve(result)
    //             }).catch(error => {
    //                 reject(error)
    //             })
    //         })
    //     }).then(result=>{
    //         return new Promise((resolve, reject) => {
    //             this.productCore.get({
    //                 id: paramValues.id
    //             }).then(result => {
    //                 resolve(result)
    //             }).catch(error => {
    //                 reject(error)
    //             })
    //         })
    //     }).then(result=>{
    //         returnData = result[0]
    //         return res.status(200).json({
    //             code: responseCode.SUCCESS,
    //             data: returnData
    //         })
    //     }).catch(error=>{
    //         return res.status(400).json(error)
    //     })
    // };

    routes() {
        this.router.get('/user-info', this.userInfo.bind(this));
        // this.router.put('/update', this.update.bind(this));
    };
};

export default UserRoute;
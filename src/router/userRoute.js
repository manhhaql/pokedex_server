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
                id: result.user.id
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
            return res.status(400).json(error)
        })
    };

    list(req, res, next) {
        const authorizationToken = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : '';
        
        if(!authorizationToken) {
            return  res.status(400).json(ErrorParser.handleAuthenticationError("Authorization token is missing"))
        }

        const {error: paramError, value: paramValues} = Joi.validate(
            {
                token: authorizationToken,
                value: req.query
            }, 
            {
                token: Joi.string().required(),
                value: Joi.object().keys(
                    {
                        username: Joi.string().regex(/^[a-zA-Z0-9, ]*$/),
                        id: Joi.number().integer().positive(),
                        type: Joi.number().integer().valid(1, 2),
                        status: Joi.number().integer().valid(1, 2),
                    }
                ).unknown()
            }
        );
        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        let returnData;
        let total;

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
            return this.userCore.get({
                username: paramValues.value.username,
                id: paramValues.value.id,
                type: paramValues.value.type,
                status: paramValues.value.status,
            })
        }).then((result) => {
            returnData = result
            return this.userCore.countTotal({})
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
                        id: Joi.number().integer().positive().required(),
                        username: Joi.string().regex(/^[a-zA-Z0-9, ]*$/),
                        type: Joi.number().integer().valid(1, 2),
                        status: Joi.number().integer().valid(1, 2),
                    }
                ).unknown()
            }
        );

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        let values = {};
        if(paramValues.value.type) {
            values.type = paramValues.value.type
        }
        if(paramValues.value.status !== null) {
            values.status = paramValues.value.status
        }
        if(paramValues.value.username) {
            values.username = paramValues.value.username
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
            return this.userCore.get({
                id: paramValues.value.id,
            })
        }).then((result) => {
            if(!result.length) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_DATA_NOT_FOUND,
                        error: "User not found"
                    })
                })
            }
            return this.userCore.update({
                id: paramValues.value.id,
                values: values
            })
        }).then((result) => {
            return this.userCore.get({
                id: paramValues.value.id,
            })
        }).then((result) => {
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: result[0]
            })
        }).catch((error) => {
            return res.status(400).json(error)
        })
    };

    routes() {
        this.router.get('/user-info', this.userInfo.bind(this));
        this.router.get('/', this.list.bind(this));
        this.router.put('/update', this.update.bind(this));
    };
};

export default UserRoute;
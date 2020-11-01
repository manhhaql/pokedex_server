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

    routes() {
        this.router.get('/user-info', this.userInfo.bind(this));
    };
};

export default UserRoute;
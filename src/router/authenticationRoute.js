import Express, { response } from 'express';
import Joi from 'joi';
import UUIDV4 from 'uuid/dist/v4';

import * as responseCode from '../constant/responseCode';

import ErrorParser from '../helper/errorParser';
import Encryption from '../helper/encryption';

import UserCore from '../core/userCore';
import AuthenticationCore from '../core/authenticationCore';
import RedisCore from '../core/redis/redisCore';

class AuthenticationRoute {
    constructor() {
        this.userCore = new UserCore();
        this.authenticationCore = new AuthenticationCore();
        this.redisCore = new RedisCore();

        this.encryption = new Encryption();

        this.router = Express.Router();
        this.routes();
    };

    signup(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.body, Joi.object().keys({
            type: Joi.number().integer().valid(1, 2).required(),
            phone: Joi.number().integer(),
            email: Joi.string(),
            username: Joi.string().regex(/^[a-zA-Z0-9, ]*$/).required(),
            password: Joi.string().required(),
            password_check: Joi.string().required(),
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError));
        };

        if(paramValues.password !== paramValues.password_check) {
            return res.status(400).json({
                code: responseCode.ERR_VALIDATION,
                error: 'Password not match'
            })
        }

        let authData = {};

        let salt = this.encryption.makeSalt().salt;
        let encryptedPassword = this.encryption.validatePassword(paramValues.password, salt);

        this.userCore.getBy({
            username: paramValues.username
        }).then(result => {
            if(result.length){
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_DATA_EXISTS,
                        error: 'Username was taken'
                    })
                })
            }

            authData.token = UUIDV4();

            return this.userCore.create({
                type: paramValues.type,
                phone: paramValues.phone,
                email: paramValues.email,
                username: paramValues.username,
                password: encryptedPassword,
                salt: salt
            })
        }).then(result => {
            return this.userCore.getBy({
                user_id: result.insertId
            })
        }).then(result => {
            authData.user = result[0];
            return this.authenticationCore.createSession({
                token: authData.token,
                user_id: authData.user.id
            })
        }).then(result => {
            return this.redisCore.setRedisToken({
                token: authData.token,
                data: authData
            })
        }).then(result => {
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: authData
            })
        }).catch(error => {
            return res.status(400).json(error)
        })
    };

    signin(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.body, Joi.object().keys({
            username: Joi.string().regex(/^[a-zA-Z0-9, ]*$/).required(),
            password: Joi.string().required(),
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError));
        };

        let authData = {};

        this.userCore.getBy({
            username: paramValues.username
        }).then(result => {
            if(!result.length){
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_DATA_NOT_FOUND,
                        error: 'Username not found'
                    })
                })
            }

            authData.token = UUIDV4();
            authData.user = result[0];

            return new Promise((resolve, reject) => {
                return resolve(result[0])
            })
        }).then(result => {
            let savedSalt = result.salt;
            let savedPassword = result.password;
            let typedPassword = this.encryption.validatePassword(paramValues.password, savedSalt);

            if(savedPassword !== typedPassword) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_VALIDATION,
                        error: 'Password is not correct'
                    })
                })
            }

            return this.authenticationCore.createSession({
                token: authData.token,
                user_id: authData.user.id
            })
        }).then(result => {
            return this.redisCore.setRedisToken({
                token: authData.token,
                data: authData
            })
        }).then(result => {
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: authData
            })
        }).catch(error => {
            return res.status(400).json(error)
        })
    };

    signout(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.body, Joi.object().keys({
            token: Joi.string().required()
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError));
        };

        this.redisCore.getRedisToken({
            token: paramValues.token
        }).then((result) => {
            if(!result) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_DATA_NOT_FOUND,
                        error: 'Token not found'
                    })
                })
            };

            return Promise.all([
                this.redisCore.removeRedisToken({
                    token: paramValues.token
                }),
                this.authenticationCore.updateSessionStatus({
                    token: paramValues.token
                })
            ]) 
        }).then((result) => {
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: 'Sign out success'
            })
        }).catch((error) => {
            return res.status(400).json(error);
        })
    }

    routes() {
        this.router.post('/signup', this.signup.bind(this));
        this.router.post('/signin', this.signin.bind(this));
        this.router.post('/signout', this.signout.bind(this));
    };
};

export default AuthenticationRoute;
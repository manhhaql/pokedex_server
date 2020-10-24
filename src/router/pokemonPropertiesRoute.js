import Express from 'express';
import Joi from 'joi';

import ErrorParser from '../helper/errorParser';
import * as responseCode from '../constant/responseCode';
import * as dataConstant from '../constant/data';

import RedisCore from '../core/redis/redisCore';
import UserCore from '../core/userCore';
import ProductPropertiesCore from '../core/pokemonPropertiesCore';

class ProductPropertiesRoute {
    constructor() {
        this.redisCore = new RedisCore();
        this.userCore = new UserCore();
        this.productPropertiesCore = new ProductPropertiesCore();

        this.router = Express.Router();
        this.routes();
    };

    list(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.query, Joi.object().keys({
            sku_id: Joi.number().integer().min(1),
            product_id: Joi.number().integer().min(1),
            type_id: Joi.number().integer().min(1),
            size_id: Joi.number().integer().min(1),
            color_id: Joi.number().integer().min(1),
            page: Joi.number().positive().not(0).default(1),
            limit: Joi.number().positive().not(0).max(500).default(10)
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        this.productPropertiesCore.get({
            sku_id: paramValues.sku_id,
            product_id: paramValues.product_id,
            type_id: paramValues.type_id,
            size_id: paramValues.size_id,
            color_id: paramValues.color_id,
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

    create(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.body, Joi.object().keys({
            token: Joi.string().required(),
            product_id: Joi.number().integer().min(1).required(),
            type_id: Joi.number().integer().min(1).max(5).required(),
            size_id: Joi.number().integer().min(1).max(12).required(),
            color_id: Joi.number().integer().min(1).required(),
            stock: Joi.number().integer().positive(),
            price: Joi.number().integer().positive()
        }).unknown());
        
        let returnData;
        let code = `${paramValues.product_id}_${paramValues.type_id}_${paramValues.size_id}_${paramValues.color_id}`;

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

            if(result[0].type !== (dataConstant.USER_ROOT && dataConstant.USER_ADMIN)) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_PERMISSION_REQUIRED,
                        error: "You don't have permission to create new SKU product"
                    })
                })
            }

            return this.productPropertiesCore.get({
                code: code
            })
        }).then(result=>{
            if(result.length) {
                return new Promise((resolve, reject)=>{
                    return reject ({
                        code: responseCode.ERROR,
                        error: `Product SKU with code = "${code}" is already existed, please enter diffrent inputs`
                    })
                })
            }
            return new Promise((resolve, reject) => {
                this.productPropertiesCore.create({
                    product_id: paramValues.product_id,
                    type_id: paramValues.type_id,
                    size_id: paramValues.size_id,
                    color_id: paramValues.color_id,
                    stock: paramValues.stock,
                    price: paramValues.price,
                    code: code
                }).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        }).then(result=>{
            return new Promise((resolve, reject) => {
                this.productPropertiesCore.get({
                    sku_id: result.insertId
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

    update(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.body, Joi.object().keys({
            token: Joi.string().required(),
            sku_id: Joi.number().integer().min(1).required(),
            product_id: Joi.number().integer().min(1),
            type_id: Joi.number().integer().min(1).max(5),
            size_id: Joi.number().integer().min(1).max(12),
            color_id: Joi.number().integer().min(1),
            stock: Joi.number().integer().positive(),
            price: Joi.number().integer().positive()
        }).unknown());
        
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

            if(result[0].type !== (dataConstant.USER_ROOT && dataConstant.USER_ADMIN)) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_PERMISSION_REQUIRED,
                        error: "You don't have permission to create new SKU product"
                    })
                })
            }

            return this.productPropertiesCore.get({
                sku_id: paramValues.sku_id
            })
        }).then(result => {
            if(!result.length) {
                return new Promise((resolve, reject)=>{
                    return reject({
                        code: responseCode.ERR_DATA_NOT_FOUND,
                        error: `Product sku with sku_id = ${paramValues.sku_id} is not exists`
                    })
                })
            };

            values.product_id = paramValues.product_id ? paramValues.product_id : result[0].product_id;
            values.type_id = paramValues.type_id ? paramValues.type_id : result[0].type_id;
            values.size_id = paramValues.size_id ? paramValues.size_id : result[0].size_id;
            values.color_id = paramValues.color_id ? paramValues.color_id : result[0].color_id;
            values.stock = paramValues.stock ? paramValues.stock : result[0].stock;
            values.price = paramValues.price ? paramValues.price : result[0].price;
            values.code = `${values.product_id}_${values.type_id}_${values.size_id}_${values.color_id}`;

            return new Promise((resolve, reject)=>{
                this.productPropertiesCore.get({
                    code: values.code
                }).then(result=>{
                    if(result.length && result[0].sku_id !== paramValues.sku_id) {
                        return new Promise((resolve, reject)=>{
                            return reject ({
                                code: responseCode.ERROR,
                                error: `Product with code = ${values.code} has applied to another product`
                            })
                        })
                    }
                    resolve(result)
                }).catch(error=>{
                    reject(error)
                })
            });
            
        }).then(result=>{
            return new Promise((resolve, reject) => {
                this.productPropertiesCore.update({
                    sku_id: paramValues.sku_id,
                    values: values
                }).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        }).then(result=>{
            return new Promise((resolve, reject) => {
                this.productPropertiesCore.get({
                    sku_id: paramValues.sku_id
                }).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            });
        }).then(result=>{
            returnData = result[0]
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: returnData
            })
        }).catch(error=>{
            return res.status(400).json(error)
        });
    };

    routes() {
        this.router.get('/list', this.list.bind(this));
        this.router.post('/create', this.create.bind(this));
        this.router.put('/update', this.update.bind(this));
    };
};

export default ProductPropertiesRoute;
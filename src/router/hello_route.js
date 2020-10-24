import Express from 'express';
import Joi from 'joi';

import ErrorParser from '../helper/errorParser';
import * as responseCode from '../constant/responseCode';

import HelloCore from '../core/hello_core';

class HelloRoute {
    constructor() {
        this.helloCore = new HelloCore();

        this.router = Express.Router();
        this.routes();
    };

    hello(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.query, Joi.object().keys({
            name: Joi.string().min(2).max(10)
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        this.helloCore.sayHello({
            name: paramValues.name
        }).then((result) => {
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: result
            })
        }).catch((error) => {
            return res.status(400).json(error)
        })
    };

    routes() {
        this.router.get('/', this.hello.bind(this));
    };
};

export default HelloRoute;
import Express from 'express';
import Joi from 'joi';

import ErrorParser from '../helper/errorParser';
import * as responseCode from '../constant/responseCode';

import PropertiesCore from '../core/propertiesCore';

class PropertiesRoute {
    constructor() {
        this.propertiesCore = new PropertiesCore();

        this.router = Express.Router();
        this.routes();
    };

    get_weakness(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.query, Joi.object().keys({
            id: Joi.number().integer().min(1)
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        this.propertiesCore.getWeakness({
            id: paramValues.id
        }).then((result) => {
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: result
            })
        }).catch((error) => {
            return res.status(400).json(error)
        })
    };

    get_type(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.query, Joi.object().keys({
            id: Joi.number().integer().min(1)
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        this.propertiesCore.getType({
            id: paramValues.id
        }).then((result) => {
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: result
            })
        }).catch((error) => {
            return res.status(400).json(error)
        })
    };

    get_ability(req, res, next) {
        const {error: paramError, value: paramValues} = Joi.validate(req.query, Joi.object().keys({
            id: Joi.number().integer().min(1)
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        this.propertiesCore.getAbility({
            id: paramValues.id
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
        this.router.get('/weakness', this.get_weakness.bind(this));
        this.router.get('/type', this.get_type.bind(this));
        this.router.get('/ability', this.get_ability.bind(this));
    };
};

export default PropertiesRoute;
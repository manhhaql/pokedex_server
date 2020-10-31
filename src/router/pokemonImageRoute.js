import Express from 'express';
import Joi from 'joi';
import Multer from 'multer';

import ErrorParser from '../helper/errorParser';
import * as responseCode from '../constant/responseCode';
import * as dataConstant from '../constant/data';
import * as fileConstant from '../constant/file';
import * as folderConstant from '../constant/folder';

import * as cloudStorage from '../core/cloud_storage';

import RedisCore from '../core/redis/redisCore';
import UserCore from '../core/userCore';
import PokemonImageCore from '../core/pokemonImageCore';

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const uploadImageToStorage = (file, pokemon_id) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No image file');
      }
      let newFileName = `${file.originalname}_${Date.now()}`;

      let fileUpload = cloudStorage.bucket.file(`${folderConstant.IMAGES}/${pokemon_id}_${newFileName}`);

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      }); 

      blobStream.on('error', (error) => {
        reject(error);
      });

      blobStream.on('finish', () => {
        const url = `https://storage.googleapis.com/${cloudStorage.bucket.name}/${fileUpload.name}`;
        resolve(url);
      });

      blobStream.end(file.buffer);
    })
}

class PokemonImageRoute {
    constructor() {

        this.redisCore = new RedisCore();
        this.userCore = new UserCore();
        this.pokemonImageCore = new PokemonImageCore();

        this.router = Express.Router();
        this.routes();
    };

    upload(req, res, next) {
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
                value: Joi.object().keys({
                    pokemon_id: Joi.number().integer().min(1).required()
                }).unknown()
            }
        );

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        if (!req.files || !req.files.file || !req.files.file.length) {
            let error = {
                code: responseCode.ERR_VALIDATION,
                error: 'file is required'
            };
            return res.status(400).json(error);
        };

        let selectedFile = req.files.file[0];
        let url;

        if (!selectedFile.mimetype.includes(fileConstant.FILE_TYPE_IMAGE)) {
            let error = {
                code: responseCode.ERR_VALIDATION,
                error: 'File type is not image'
            };

            return res.status(400).json(error);
        };

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

            return this.pokemonImageCore.get({
                pokemon_id: paramValues.pokemon_id
            })
        }).then((result)=>{
            if (result.length) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_PRODUCT_IMAGE_EXISTS,
                        error: 'This pokemon already have image'
                    });
                });
            }

            return uploadImageToStorage(selectedFile, paramValues.pokemon_id)
        }).then((result)=>{

            url = result;
            return new Promise((resolve, reject)=>{
                this.pokemonImageCore.saveImageToDB({
                    pokemon_id: paramValues.pokemon_id,
                    url: url
                }).then((result)=>{
                    resolve(result)
                }).catch((error)=>{
                    reject(error)
                })
            })
        }).then((result)=>{
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: {
                    pokemon_id: paramValues.pokemon_id,
                    url: url
                }
            });
        }).catch((error)=>{
            return res.status(400).json(error)
        });
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
                value: Joi.object().keys({
                    pokemon_id: Joi.number().integer().min(1).required()
                }).unknown()
            }
        );

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        if (!req.files || !req.files.file || !req.files.file.length) {
            let error = {
                code: responseCode.ERR_VALIDATION,
                error: 'file is required'
            };
            return res.status(400).json(error);
        };

        let selectedFile = req.files.file[0];
        let url;

        if (!selectedFile.mimetype.includes(fileConstant.FILE_TYPE_IMAGE)) {
            let error = {
                code: responseCode.ERR_VALIDATION,
                error: 'File type is not image'
            };

            return res.status(400).json(error);
        };

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
                        error: "You don't have permission to update pokemon image"
                    })
                })
            }

            return this.pokemonImageCore.get({
                pokemon_id: paramValues.value.pokemon_id
            })
        }).then((result)=>{
            if (!result.length) {
                return new Promise((resolve, reject) => {
                    return reject({
                        code: responseCode.ERR_DATA_NOT_FOUND,
                        error: "This pokemon don't have image yet"
                    });
                });
            }

            return uploadImageToStorage(selectedFile, paramValues.value.pokemon_id)
        }).then((result)=>{

            url = result;
            return new Promise((resolve, reject)=>{
                this.pokemonImageCore.update({
                    pokemon_id: paramValues.value.pokemon_id,
                    values: {url: url}
                }).then((result)=>{
                    resolve(result)
                }).catch((error)=>{
                    reject(error)
                })
            })
        }).then((result)=>{
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: {
                    pokemon_id: paramValues.value.pokemon_id,
                    url: url
                }
            });
        }).catch((error)=>{
            return res.status(400).json(error)
        });
    };

    list(req, res, next) {

        const { error: paramError, value: paramValues } = Joi.validate(req.query, Joi.object().keys({
            pokemon_id: Joi.number().integer(),
            page: Joi.number().positive().not(0).default(1),
            limit: Joi.number().positive().not(0).max(500).default(10)
        }).unknown());

        if(paramError) {
            return res.status(400).json(ErrorParser.handleJoiError(paramError))
        }

        this.pokemonImageCore.get({
            pokemon_id: paramValues.pokemon_id,
            page: paramValues.page,
            limit: paramValues.limit
        }).then((result)=>{
            return res.status(200).json({
                code: responseCode.SUCCESS,
                data: result
            });
        }).catch((error)=>{
            return res.status(400).json(error)
        });
    };

    routes() {
        this.router.post('/upload', multer.fields([{ name: 'file', maxCount: 1 }]), this.upload.bind(this));
        this.router.put('/update', multer.fields([{ name: 'file', maxCount: 1 }]), this.update.bind(this));
        this.router.get('/list', this.list.bind(this));
    };
};

export default PokemonImageRoute;
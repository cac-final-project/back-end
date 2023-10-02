import Joi from 'joi';

export const findResources_validation = Joi.object({
    lon: Joi.number().required(),
    lat: Joi.number().required(),
}).unknown(false);

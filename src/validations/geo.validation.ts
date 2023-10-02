import Joi from 'joi';

export const geocoding_validation = Joi.object({
    lon: Joi.string().required(),
    lat: Joi.string().required(),
}).unknown(false);

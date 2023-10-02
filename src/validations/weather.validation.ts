import Joi from 'joi';

export const get_emergencyData_validation = Joi.object({
    lon: Joi.string().required(),
    lat: Joi.string().required(),
}).unknown(false);

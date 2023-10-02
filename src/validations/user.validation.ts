import Joi from 'joi';

export const create_user_validation = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    phone_no: Joi.string().required(),
    type: Joi.string().valid('user', 'volunteer').required(),
}).unknown(false);

export const login_user_validation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
}).unknown(false);

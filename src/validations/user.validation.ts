import Joi from 'joi';

export const create_user_validation = Joi.object({
    username: Joi.string().required(),
    nickname: Joi.string().required(),
    password: Joi.string().required(),
    phone_no: Joi.string().required(),
    type: Joi.string().valid('neighbor', 'volunteer').required(),
}).unknown(false);

export const login_user_validation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
}).unknown(false);

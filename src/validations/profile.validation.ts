import Joi from 'joi';

export const updateProfile_validation = Joi.object({
    bio: Joi.string().max(500).optional(),
}).unknown(false); // Doesn't allow unknown fields

export const getAuthorProfile_validation = Joi.object({
    author: Joi.string().required(),
}).unknown(false); // Doesn't allow unknown fields

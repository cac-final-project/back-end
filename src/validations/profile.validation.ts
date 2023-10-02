import Joi from 'joi';

export const updateProfile_validation = Joi.object({
    bio: Joi.string().max(500).optional(),
}).unknown(false); // Doesn't allow unknown fields

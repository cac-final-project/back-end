import Joi from 'joi';

export const voteValidation = Joi.object({
    postId: Joi.number().integer().positive().required(),
    direction: Joi.string().valid('up', 'down').required(),
}).unknown(false); // Doesn't allow unknown fields

export const fetchPostsValidation = Joi.object({
    type: Joi.string().valid('tip', 'campaign'),
    author: Joi.string(),
    page: Joi.number().integer().min(1).default(1).label('Page'),
    limit: Joi.number().integer().min(1).max(100).default(10).label('Limit'),
});

export const create_post_validation = Joi.object({
    type: Joi.string().valid('tip', 'campaign').required(),
    title: Joi.string().max(255).required(),
    content: Joi.string().required(),
    lat: Joi.number().optional(),
    lon: Joi.number().optional(),
    addressName: Joi.string().optional(),
});

export const fetch_post_validation = Joi.object({
    postId: Joi.number().integer().positive().required(),
});

export const delete_post_validation = Joi.object({
    postId: Joi.number().integer().positive().required(),
});

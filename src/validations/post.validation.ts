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
    type: Joi.string().valid('tip', 'campaign').required(), // Ensures the post is of type 'tip'
    title: Joi.string().max(255).required(), // Title with a max length of 255 characters
    content: Joi.string().required(), // No length limit for content
    // voteCount is omitted since it will have a default value
    lat: Joi.number().optional(), // Optional latitude
    lon: Joi.number().optional(), // Optional longitude
});

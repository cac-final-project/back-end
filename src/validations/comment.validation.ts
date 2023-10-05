import Joi from 'joi';

export const create_comment_validation = Joi.object({
    content: Joi.string().required(),
    postId: Joi.number().integer().positive().required(),
});

export const comment_vote_validation = Joi.object({
    commentId: Joi.number().integer().positive().required(),
    direction: Joi.string().valid('up', 'down').required(),
}).unknown(false); // Doesn't allow unknown fields

import { RequestHandler } from 'express';
import Joi from 'joi';
import { validationJoiOptions } from '@/utils/JoiOptions';
import { customResponse } from '@/common/index';
import { StatusCodes } from 'http-status-codes';

const payloadValidation = (schema: Joi.Schema): RequestHandler => {
    const handler: RequestResponseHandler = async (req, res, next) => {
        const response = customResponse(res);
        try {
            const value = await schema.validateAsync(
                req.body,
                validationJoiOptions,
            );
            req.body = { ...value };
            next();
        } catch (e: any) {
            const errors: string[] = [];
            e.details.forEach((error: Joi.ValidationErrorItem) => {
                errors.push(error.message);
            });
            response.error({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: errors.join(', '),
            });
        }
    };
    return handler;
};

export default payloadValidation;

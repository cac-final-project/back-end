import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import { BadRequest } from '@/common/index';
import { StatusCodes } from 'http-status-codes';

const formValidation = (schema: Joi.Schema): RequestHandler => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };
        if (!req.is('multipart/form-data')) {
            const badRequest = new BadRequest(
                'Must be multipart/form-data format',
                [],
            );
            res.status(badRequest.statusCode).json({
                result: false,
                code: StatusCodes.BAD_REQUEST,
                message: badRequest.message,
            });
            return;
        }

        const req_data: { [key: string]: any } = { ...req.body };

        // null 로 주나, undefined 이거나 multer는 무조건 undefined을 반환...
        // if undefined => db profile_img 건들지 말기

        if (req.file !== undefined) {
            // If file is present, include it
            req_data.profile_img = req.file.path;
        } else {
            // If file key exists and it's an empty string, delete it
            delete req_data.profile_img;
        }

        const parsedBody: { [key: string]: any } = {};

        Object.entries(req_data).forEach(([key, value]) => {
            if (typeof value === 'string') {
                try {
                    parsedBody[key] = JSON.parse(value);
                } catch {
                    parsedBody[key] = value;
                }
            } else {
                parsedBody[key] = value;
            }
        });

        try {
            const value = await schema.validateAsync(
                parsedBody,
                validationOptions,
            );
            req.body = parsedBody;
            next();
        } catch (e: any) {
            const errors: string[] = [];
            e.details.forEach((error: Joi.ValidationErrorItem) => {
                errors.push(error.message);
            });
            const badRequest = new BadRequest(errors.join(', '), errors);
            res.status(badRequest.statusCode).json({
                result: false,
                message: badRequest.errors,
            });
        }
    };
};

export default formValidation;

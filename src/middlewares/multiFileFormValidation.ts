import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import { BadRequest } from '@/common/index';
import { StatusCodes } from 'http-status-codes';

const multiFileFormValidation = (schema: Joi.Schema): RequestHandler => {
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

        if (req.files && Array.isArray(req.files)) {
            // If files are present, include their paths in an array
            req_data.img_url = req.files.map(
                (file: Express.Multer.File) => file.path,
            );
        } else {
            delete req_data.img_url;
        }

        // Processing tags
        if (req_data.tags && typeof req_data.tags === 'string') {
            // Splitting the tags string into an array
            req_data.tags = req_data.tags.split(',').map((tag) => tag.trim());
        } else {
            delete req_data.tags;
        }

        console.log('middleware', req_data);

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

export default multiFileFormValidation;

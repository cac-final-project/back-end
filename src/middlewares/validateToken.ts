import { Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import BadRequest from '@/common/bad-request';
import { verifyToken } from '@/utils/token';
import { customResponse } from '@/common/index';
import { userRepository } from '@/repositories/index';

const validateToken = (): RequestHandler => {
    return async (
        req: CustomRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const response = customResponse(res);
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const badRequest = new BadRequest('', [
                'Authorization header is missing or invalid.',
            ]);
            res.status(badRequest.statusCode).json({
                result: false,
                message: badRequest.errors,
            });
            return;
        }
        const token = authHeader?.split(' ')[1];
        if (!token) {
            const badRequest = new BadRequest('', ['Invalid bearer token.']);
            res.status(badRequest.statusCode).json({
                result: false,
                message: badRequest.message,
            });
            return;
        }
        try {
            const verifiedToken = verifyToken(token!);
            const user = await userRepository.findByUsername(
                verifiedToken.username,
            );
            req.username = verifiedToken.username;
            req.user_id = user?.id;
            req.token = token;
            next();
        } catch (error) {
            response.error({
                code: StatusCodes.BAD_REQUEST,
                message: 'Invalid token',
            });
            return;
        }
    };
};

export default validateToken;

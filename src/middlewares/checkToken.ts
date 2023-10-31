import { Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '@/utils/token';
import { customResponse } from '@/common/index';
import { userRepository } from '@/repositories/index';

const checkToken = (): RequestHandler => {
    return async (
        req: CustomRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const response = customResponse(res);
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            if (token) {
                try {
                    const verifiedToken = verifyToken(token);
                    const user = await userRepository.findByUsername(
                        verifiedToken.username,
                    );

                    // Attach additional data to the request
                    req.username = verifiedToken.username;
                    req.user_id = user?.id;
                    req.token = token;
                } catch (error) {
                    // If there's an error with the token, log it, but don't block the request
                    console.error('Token verification failed:', error);
                }
            }
        }

        // Proceed to the next middleware/function regardless of token presence
        next();
    };
};

export default checkToken;

import { Request, Response, NextFunction } from 'express';

interface RequestHandler {
    (req: Request, res: Response, next?: NextFunction): Promise<any>;
}

const asyncWrapper = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export default asyncWrapper;

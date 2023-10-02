import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const multerErrorHandling: IErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.error(err);
        res.status(500).send(err.message);
    } else if (err) {
        // An unknown error occurred when uploading.
        console.error(err);
        res.status(500).send(err.message);
    }

    // Everything went fine, pass control to the next middleware.
    next();
};

export default multerErrorHandling;

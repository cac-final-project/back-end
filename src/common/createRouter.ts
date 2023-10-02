import { Router, Request, Response, NextFunction } from 'express';

declare global {
    interface IMiddleware {
        (req: Request, res: Response, next: NextFunction): void;
    }
    interface IErrorMiddleware {
        (err: any, req: Request, res: Response, next: NextFunction): void;
    }
    type Middleware = IMiddleware | IErrorMiddleware;

    type RequestResponseHandler = (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => Promise<void>;
    interface IRouteOptions {
        method: 'get' | 'post' | 'put' | 'delete';
        path: string;
        middleware: Middleware[];
        handler: RequestResponseHandler;
    }
}

export const createRoutes = (
    authRoutes: Record<string, IRouteOptions>,
    router: Router,
): void => {
    Object.values(authRoutes).forEach(
        ({ method, middleware, handler, path }: IRouteOptions) => {
            if (middleware.length) {
                router.route(path)[method](...middleware, handler);
            } else {
                router.route(path)[method](handler);
            }
        },
    );
};

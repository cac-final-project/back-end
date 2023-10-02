import { queryValidation, validateToken } from '@/middlewares/index';
import { findResources_validation } from '@/validations/index';

export function createResourcesRoutes(
    path: string,
    findResourcesHandler: RequestResponseHandler,
): CustomRoutes {
    return {
        findResources: {
            method: 'get',
            path: `${path}`,
            middleware: [
                // validateToken(),
                queryValidation(findResources_validation),
            ],
            handler: findResourcesHandler,
        },
    };
}

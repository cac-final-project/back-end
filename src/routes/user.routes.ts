import { payloadValidation, validateToken } from '@/middlewares/index';
import {
    create_user_validation,
    login_user_validation,
} from '@/validations/index';

export function createUserRoutes(
    path: string,
    createHandler: RequestResponseHandler,
    loginHandler: RequestResponseHandler,
    validateTokenHandler: RequestResponseHandler,
): CustomRoutes {
    return {
        create: {
            method: 'post',
            path: `${path}`,
            middleware: [payloadValidation(create_user_validation)],
            handler: createHandler,
        },
        login: {
            method: 'post',
            path: `${path}/login`,
            middleware: [payloadValidation(login_user_validation)],
            handler: loginHandler,
        },
        validateToken: {
            method: 'post',
            path: `${path}/validateToken`,
            middleware: [validateToken()],
            handler: validateTokenHandler,
        },
    };
}

import { payloadValidation, validateToken } from '@/middlewares/index';
import {
    create_user_validation,
    login_user_validation,
    username_dup_validation,
    send_sms_validation,
} from '@/validations/index';

export function createUserRoutes(
    path: string,
    createHandler: RequestResponseHandler,
    loginHandler: RequestResponseHandler,
    validateTokenHandler: RequestResponseHandler,
    checkUsername: RequestResponseHandler,
    sendSms: RequestResponseHandler,
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
        checkUsername: {
            method: 'post',
            path: `${path}/checkUsername`,
            middleware: [payloadValidation(username_dup_validation)],
            handler: checkUsername,
        },
        sendSms: {
            method: 'post',
            path: `${path}/sendSms`,
            middleware: [payloadValidation(send_sms_validation)],
            handler: sendSms,
        },
    };
}

import {
    validateToken,
    multerErrorHandling,
    formValidation,
    queryValidation,
} from '@/middlewares/index';
import {
    getAuthorProfile_validation,
    updateProfile_validation,
} from '@/validations/index';
import { upload } from '@/utils/multerSetup';

export function createProfileRoutes(
    path: string,
    getProfileHandler: RequestResponseHandler,
    getAuthorProfileHandler: RequestResponseHandler,
    updateProfileHandler: RequestResponseHandler,
): CustomRoutes {
    return {
        getProfile: {
            method: 'get',
            path: `${path}`,
            middleware: [validateToken()],
            handler: getProfileHandler,
        },
        getAuthorProfile: {
            method: 'get',
            path: `${path}/author`,
            middleware: [
                validateToken(),
                queryValidation(getAuthorProfile_validation),
            ],
            handler: getAuthorProfileHandler,
        },
        updateProfile: {
            method: 'put',
            path: `${path}`,
            middleware: [
                upload.single('file'),
                multerErrorHandling,
                validateToken(),
                formValidation(updateProfile_validation),
            ],
            handler: updateProfileHandler,
        },
    };
}

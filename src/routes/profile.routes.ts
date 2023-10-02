import {
    validateToken,
    multerErrorHandling,
    formValidation,
} from '@/middlewares/index';
import {
    // getProfile_validation,
    updateProfile_validation,
} from '@/validations/index';
import { upload } from '@/utils/multerSetup';

export function createProfileRoutes(
    path: string,
    getProfileHandler: RequestResponseHandler,
    updateProfileHandler: RequestResponseHandler,
): CustomRoutes {
    return {
        getProfile: {
            method: 'get',
            path: `${path}`,
            middleware: [validateToken()],
            handler: getProfileHandler,
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

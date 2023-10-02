import {
    payloadValidation,
    multerErrorHandling,
    formValidation,
} from '@/middlewares/index';
import { create_user_validation } from '@/validations/index';
import { upload } from '@/utils/multerSetup';

export function createUserRoutes(
    path: string,
    createHandler: RequestResponseHandler,
    getUserHandler: RequestResponseHandler,
): CustomRoutes {
    return {};
}

import {
    payloadValidation,
    validateToken,
    queryValidation,
} from '@/middlewares/index';
import {
    create_tip_validation,
    voteValidation,
    fetchPostsValidation,
} from '@/validations/index';

export function createPostRoutes(
    path: string,
    createTipHandler: RequestResponseHandler,
    voteHandler: RequestResponseHandler,
    fetchPostsHandler: RequestResponseHandler,
): CustomRoutes {
    return {
        createPost: {
            method: 'post',
            path: `${path}`,
            middleware: [
                validateToken(),
                payloadValidation(create_tip_validation),
            ],
            handler: createTipHandler,
        },
        vote: {
            method: 'post',
            path: `${path}/vote`,
            middleware: [validateToken(), payloadValidation(voteValidation)],
            handler: voteHandler,
        },
        fetchPosts: {
            method: 'get',
            path: `${path}`,
            middleware: [
                validateToken(),
                queryValidation(fetchPostsValidation),
            ],
            handler: fetchPostsHandler,
        },
    };
}

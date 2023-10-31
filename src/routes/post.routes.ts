import {
    payloadValidation,
    validateToken,
    queryValidation,
    multerErrorHandling,
    multiFileFormValidation,
} from '@/middlewares/index';
import {
    create_post_validation,
    voteValidation,
    fetchPostsValidation,
    fetch_post_validation,
} from '@/validations/index';
import { upload } from '@/utils/multerSetup';

export function createPostRoutes(
    path: string,
    createTipHandler: RequestResponseHandler,
    voteHandler: RequestResponseHandler,
    fetchPostsHandler: RequestResponseHandler,
    fetchPostHandler: RequestResponseHandler,
    fetchTagsHandler: RequestResponseHandler,
    deletePostHandler: RequestResponseHandler,
): CustomRoutes {
    return {
        createPost: {
            method: 'post',
            path: `${path}`,
            middleware: [
                upload.array('files', 2), // assuming max 10 files
                multerErrorHandling,
                validateToken(),
                multiFileFormValidation(create_post_validation),
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
            middleware: [queryValidation(fetchPostsValidation)],
            handler: fetchPostsHandler,
        },

        fetchPost: {
            method: 'get',
            path: `${path}/single`,
            middleware: [
                validateToken(),
                queryValidation(fetch_post_validation),
            ],
            handler: fetchPostHandler,
        },
        fetchTags: {
            method: 'get',
            path: `${path}/tags`,
            middleware: [],
            handler: fetchTagsHandler,
        },
        deletePost: {
            method: 'delete',
            path: `${path}`,
            middleware: [
                validateToken(),
                queryValidation(fetch_post_validation),
            ],
            handler: deletePostHandler,
        },
    };
}

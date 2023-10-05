import { payloadValidation, validateToken } from '@/middlewares/index';
import {
    create_comment_validation,
    comment_vote_validation,
} from '@/validations/index';

export function createCommentRoutes(
    path: string,
    createCommentHandler: RequestResponseHandler,
    commentVoteHandler: RequestResponseHandler,
): CustomRoutes {
    return {
        createPost: {
            method: 'post',
            path: `${path}`,
            middleware: [
                validateToken(),
                payloadValidation(create_comment_validation),
            ],
            handler: createCommentHandler,
        },

        commentVote: {
            method: 'post',
            path: `${path}/vote`,
            middleware: [
                validateToken(),
                payloadValidation(comment_vote_validation),
            ],
            handler: commentVoteHandler,
        },
    };
}

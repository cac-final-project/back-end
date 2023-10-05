import { Router } from 'express';
import { asyncWrapper, customResponse, createRoutes } from '@/common/index';
import { StatusCodes } from 'http-status-codes';
import { createCommentRoutes } from '@/routes/comment.routes';
import { commentService } from '@/services/index';

class CommentController implements Controller {
    public path = '/comment';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const customRoutes: CustomRoutes = createCommentRoutes(
            this.path,
            this.createComment,
            this.commentVote,
        );
        createRoutes(customRoutes, this.router);
    }

    private createComment: RequestResponseHandler = asyncWrapper(
        async (req: CustomRequest, res) => {
            const response = customResponse(res);
            const username = req.username;
            const user_id = req.user_id;
            const comment: CommentsCreateInterface = {
                ...req.body,
                post_id: req.body.postId,
                user_id,
                username,
            };
            console.log(comment);
            try {
                const res = await commentService.createComment(comment);
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );

    private commentVote: RequestResponseHandler = asyncWrapper(
        async (req: CustomRequest, res) => {
            const response = customResponse(res);
            const user_id = req.user_id;
            const vote: commentsVoteData = { ...req.body, userId: user_id! };
            try {
                const res = await commentService.commentVote(vote);
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );
}

export default CommentController;

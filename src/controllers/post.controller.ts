import { Router } from 'express';
import { asyncWrapper, customResponse, createRoutes } from '@/common/index';
import { StatusCodes } from 'http-status-codes';
import { createPostRoutes } from '@/routes/post.routes';
import { postService } from '@/services/index';

class PostController implements Controller {
    public path = '/post';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const customRoutes: CustomRoutes = createPostRoutes(
            this.path,
            this.createPost,
            this.vote,
            this.fetchPosts,
        );
        createRoutes(customRoutes, this.router);
    }

    private createPost: RequestResponseHandler = asyncWrapper(
        async (req, res) => {
            const response = customResponse(res);
            const post: Post = req.body;
            try {
                const res = await postService.createPost(post);
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );

    private vote: RequestResponseHandler = asyncWrapper(async (req, res) => {
        const response = customResponse(res);
        const vote: voteData = req.body;
        try {
            const res = await postService.vote(vote);
            response.success({ code: StatusCodes.CREATED, data: res });
        } catch (err) {
            response.error(err as ErrorData);
        }
    });

    private fetchPosts: RequestResponseHandler = asyncWrapper(
        async (req, res) => {
            const response = customResponse(res);
            const fetchPostsData: fetchPostsData = req.body;
            try {
                const res = await postService.fetchPosts(fetchPostsData);
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );
}

export default PostController;

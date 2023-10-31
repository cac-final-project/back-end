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
            this.fetchPost,
            this.fetchTags,
            this.deletePost,
        );
        createRoutes(customRoutes, this.router);
    }

    private createPost: RequestResponseHandler = asyncWrapper(
        async (req: CustomRequest, res) => {
            const response = customResponse(res);
            const username = req.username;
            const post: Post = { ...req.body, author: username };
            console.log(post);
            try {
                const res = await postService.createPost(post);
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );

    private vote: RequestResponseHandler = asyncWrapper(
        async (req: CustomRequest, res) => {
            const response = customResponse(res);
            const user_id = req.user_id;
            const vote: voteData = { ...req.body, userId: user_id! };
            try {
                const res = await postService.vote(vote);
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );

    private fetchPosts: RequestResponseHandler = asyncWrapper(
        async (req: CustomRequest, res) => {
            const response = customResponse(res);

            const fetchPostsData: fetchPostsData = {
                ...req.body,
            };
            try {
                const res = await postService.fetchPosts(fetchPostsData);
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );

    private fetchPost: RequestResponseHandler = asyncWrapper(
        async (req: CustomRequest, res) => {
            const response = customResponse(res);
            const user_id = req.user_id;
            const fetchPostsData: fetchPostData = {
                ...req.body,
                post_id: req.body.postId,
                userId: user_id,
            };
            try {
                const res = await postService.fetchPost(fetchPostsData);
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );

    private fetchTags: RequestResponseHandler = asyncWrapper(
        async (req: CustomRequest, res) => {
            const response = customResponse(res);
            try {
                const res = await postService.fetchTags();
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );

    private deletePost: RequestResponseHandler = asyncWrapper(
        async (req: CustomRequest, res) => {
            const response = customResponse(res);
            const user_id = req.user_id;
            const fetchPostsData: fetchPostData = {
                ...req.body,
                post_id: req.body.postId,
                userId: user_id,
            };
            try {
                const res = await postService.deletePost(fetchPostsData);
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );
}

export default PostController;

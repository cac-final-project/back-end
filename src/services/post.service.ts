import { cloudinary } from '@/apis/index';
import fs from 'fs';
import {
    postRepository,
    userRepository,
    voteRepository,
    postImageRepository,
    postTagsRepository,
    commentRepository,
} from '@/repositories/index';
import { customErrorMsg } from '@/exceptions/index';

export const postService = {
    postRepository,
    userRepository,
    voteRepository,
    postImageRepository,
    postTagsRepository,
    commentRepository,

    async createPost(postData: Post) {
        const { type, tags, img_url, author } = postData;
        const user = await this.userRepository.findByUsername(author);
        if (type === 'tip') {
            if (postData.lat || postData.lon) {
                return customErrorMsg('tip cannot include either lat or lon');
            }
            const tip = await this.postRepository.createPost(postData);
            if (img_url && img_url.length > 0) {
                const imageUploadPromises: Promise<PostImage>[] = img_url.map(
                    async (item) => {
                        const { secure_url } = await cloudinary(item);
                        fs.unlinkSync(item);
                        return this.postImageRepository.createPostImage({
                            post_id: tip.id,
                            img_url: secure_url!,
                        });
                    },
                );

                await Promise.all(imageUploadPromises);
            }

            if (tags) {
                if (tags.length !== 0) {
                    tags.map((item) => {
                        return this.postTagsRepository.createPostTags({
                            post_id: tip.id,
                            name: item,
                        });
                    });
                }
            }
            return tip;
        } else {
            if (!postData.lat || !postData.lon) {
                return customErrorMsg('lat or lon is missing');
            } else if (user?.type === 'user') {
                return customErrorMsg('only volunteers can create campaign');
            } else {
                const campaign = await this.postRepository.createPost(postData);
                if (img_url && img_url.length > 0) {
                    const imageUploadPromises: Promise<PostImage>[] =
                        img_url.map(async (item) => {
                            const { secure_url } = await cloudinary(item);
                            fs.unlinkSync(item);
                            return this.postImageRepository.createPostImage({
                                post_id: campaign.id,
                                img_url: secure_url!,
                            });
                        });

                    await Promise.all(imageUploadPromises);
                }
                if (tags) {
                    if (tags.length !== 0) {
                        tags.map((item) => {
                            return this.postTagsRepository.createPostTags({
                                post_id: campaign.id,
                                name: item,
                            });
                        });
                    }
                }
                return campaign;
            }
        }
        return;
    },

    async vote(voteData: voteData) {
        await this.voteRepository.vote(voteData);
        return;
    },

    async fetchPosts(fetchPostsData: fetchPostsData): Promise<Post[]> {
        return this.postRepository.fetchPosts(fetchPostsData);
    },

    async fetchPost(fetchPostData: fetchPostData) {
        const post = await this.postRepository.fetchPost(fetchPostData);

        const images = await this.postImageRepository.fetchImagesByPostId(
            fetchPostData,
        );

        const imageUrls = images.map((img) => img.dataValues.img_url);

        console.log(imageUrls);

        const comments = await this.commentRepository.findByPostId(
            fetchPostData,
        );

        const commentContents = comments.map((comment) => comment.dataValues);

        console.log(commentContents);

        return { ...post.dataValues, comments: commentContents, imageUrls };
    },
};

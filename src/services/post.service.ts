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
import { db } from '../database';

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
            } else if (user?.type === 'neighbor') {
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

        const tags = await this.postTagsRepository.fetchTagsByPost(
            fetchPostData,
        );

        const tagItems = tags.map((item) => item.name);

        const comments = await this.commentRepository.findByPostId(
            fetchPostData,
        );

        const commentContents = comments.map((comment) => comment.dataValues);

        return { ...post, comments: commentContents, imageUrls, tagItems };
    },

    async fetchTags() {
        const tags = await this.postTagsRepository.fetchAllTags();
        return tags;
    },

    async deletePost(fetchPostData: fetchPostData) {
        console.log(fetchPostData);
        const { post_id } = fetchPostData;
        const post = await this.postRepository.findPostbyPk(fetchPostData);

        if (post) {
            await this.voteRepository.deleteVote(post_id);
            await this.postImageRepository.deletePostImage(post_id);
            await this.postTagsRepository.deletePostTags(post_id);
            await this.commentRepository.deleteComment(post_id);
            await this.postRepository.deletePost(post_id);
            return true;
        } else {
            return false;
        }
    },

    async editPost(postData: Post, post_id: number) {
        // Step 1: Retrieve Existing Post
        const post = await this.postRepository.findPostbyPk({ post_id });
        if (!post) {
            return customErrorMsg('Post not found');
        }

        // Step 2: Update Post Data
        const updatedPost = await post.update(postData);

        // Step 3: Update/Delete Images
        const existingImages =
            await this.postImageRepository.fetchImagesByPostId({
                post_id,
            });
        const existingImageUrls = existingImages.map((img) => img.img_url);
        const newImages = postData.img_url || [];

        // Delete images
        const imagesToDelete = existingImageUrls.filter(
            (url) => !newImages.includes(url),
        );
        await Promise.all(
            imagesToDelete.map((url) =>
                this.postImageRepository.deleteImageByUrl(url),
            ),
        );

        // Upload and add new images
        const imagesToAdd = newImages.filter(
            (url) => !existingImageUrls.includes(url),
        );
        const imageUploadPromises = imagesToAdd.map(async (item) => {
            const { secure_url } = await cloudinary(item);
            fs.unlinkSync(item);
            return this.postImageRepository.createPostImage({
                post_id: post_id,
                img_url: secure_url!,
            });
        });
        await Promise.all(imageUploadPromises);

        // Step 4: Override Tags
        // Delete existing tags
        await this.postTagsRepository.deletePostTags(post_id);

        // Add new tags
        const newTags = postData.tags || [];
        newTags.forEach(async (name) => {
            await this.postTagsRepository.createPostTags({ post_id, name });
        });

        return updatedPost;
    },
};

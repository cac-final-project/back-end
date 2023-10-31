import { db } from '@/database/index';
import { dbException, customErrorMsg } from '@/exceptions/index';

export const postImageRepository = {
    async createPostImage(postImageData: PostImageCreateInterface) {
        try {
            const postImage = await db.PostImage.create(postImageData);
            return postImage;
        } catch (err) {
            return dbException(err);
        }
    },

    async deletePostImage(post_id: number) {
        try {
            await db.PostImage.destroy({
                where: { post_id: post_id },
            });
        } catch (err) {
            return dbException(err);
        }
    },

    async fetchImagesByPostId(postData: fetchPostData) {
        const { post_id } = postData;
        try {
            const images = await db.PostImage.findAll({
                where: {
                    post_id: post_id,
                },
            });

            if (images.length === 0) {
                return customErrorMsg('No images found for the given post ID');
            }

            return images;
        } catch (err) {
            return dbException(err);
        }
    },
};

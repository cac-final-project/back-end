import { db } from '@/database/index';
import { dbException } from '@/exceptions/index';

export const postImageRepository = {
    async createPostImage(postImageData: PostImageCreateInterface) {
        try {
            const postImage = await db.PostImage.create(postImageData);
            return postImage;
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
                throw new Error('No images found for the given post ID'); // Or return an empty array if you prefer
            }

            return images;
        } catch (err) {
            return dbException(err);
        }
    },
};

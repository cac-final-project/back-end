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

            // if (images.length === 0) {
            //     return customErrorMsg('No images found for the given post ID');
            // }

            return images;
        } catch (err) {
            return dbException(err);
        }
    },

    async deleteImageByUrl(img_url: string) {
        try {
            const result = await db.PostImage.destroy({
                where: { img_url: img_url },
            });

            if (result === 0) {
                // Optional: handle the case where no record was found to delete
                return customErrorMsg('No image found with the given URL');
            }

            return; // Successfully deleted
        } catch (err) {
            return dbException(err);
        }
    },
};

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
};

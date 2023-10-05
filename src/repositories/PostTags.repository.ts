import { db } from '@/database/index';
import { dbException } from '@/exceptions/index';

export const postTagsRepository = {
    async createPostTags(postTagsData: TagCreateInterface) {
        try {
            const postImage = await db.PostTags.create(postTagsData);
            return postImage;
        } catch (err) {
            return dbException(err);
        }
    },
};

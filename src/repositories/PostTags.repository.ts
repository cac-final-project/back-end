import { db } from '@/database/index';
import { dbException, customErrorMsg } from '@/exceptions/index';

export const postTagsRepository = {
    async createPostTags(postTagsData: TagCreateInterface) {
        try {
            const postImage = await db.PostTags.create(postTagsData);
            return postImage;
        } catch (err) {
            return dbException(err);
        }
    },
    async fetchTagsByPost(fetchPostData: fetchPostData) {
        const { post_id } = fetchPostData;
        try {
            const tags = await db.PostTags.findAll({
                where: { post_id: post_id },
            });

            if (tags.length === 0) {
                return customErrorMsg('No images found for the given post ID');
            }

            // Assuming each row in PostTags has a 'tag' field.
            // Extract only the tag values into an array.
            return tags;
        } catch (err) {
            return dbException(err);
        }
    },
};

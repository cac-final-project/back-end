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
    async deletePostTags(post_id: number) {
        try {
            await db.PostTags.destroy({
                where: { post_id: post_id },
            });
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

            // if (tags.length === 0) {
            //     return customErrorMsg('No images found for the given post ID');
            // }

            return tags;
        } catch (err) {
            return dbException(err);
        }
    },
    async fetchAllTags() {
        try {
            const tags = await db.PostTags.findAll();

            if (tags.length === 0) {
                return [];
            }

            // Create a Set from the mapped tag names to ensure uniqueness
            const uniqueTagNames = new Set(tags.map((tag) => tag.name));

            // Convert the Set back into an array
            return Array.from(uniqueTagNames);
        } catch (err) {
            return dbException(err);
        }
    },
};

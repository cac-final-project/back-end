import { db } from '@/database/index';
import { dbException } from '@/exceptions/index';

export const commentRepository = {
    async create(commentData: CommentsCreateInterface) {
        try {
            const comment = await db.Comments.create(commentData);
            return comment;
        } catch (err) {
            return dbException(err);
        }
    },
    async deleteComment(post_id: number) {
        try {
            await db.Comments.destroy({
                where: { post_id: post_id },
            });
        } catch (err) {
            return dbException(err);
        }
    },

    async findByPostId(fetchPostData: fetchPostData) {
        const { post_id } = fetchPostData;
        try {
            const comments = await db.Comments.findAll({
                where: { post_id },
            });
            return comments;
        } catch (err) {
            return dbException(err);
        }
    },
};

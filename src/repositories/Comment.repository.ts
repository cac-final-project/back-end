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

    async findByPostId(post_id: number) {
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

import { db } from '@/database/index';
import { dbException, customErrorMsg } from '@/exceptions/index';

declare global {
    interface voteData {
        userId: number;
        postId: number;
        direction: 'up' | 'down';
    }
}

export const voteRepository = {
    async vote(voteData: voteData) {
        const { userId, postId, direction } = voteData;
        try {
            const existingVote = await db.Vote.findOne({
                where: {
                    userId: userId,
                    postId: postId,
                },
            });

            let voteValue;

            if (existingVote) {
                if (existingVote.direction === direction) {
                    return customErrorMsg('This action is not allowed');
                } else {
                    existingVote.direction = direction;
                    await existingVote.save();
                    voteValue = direction === 'up' ? 2 : -2;
                }
            } else {
                await db.Vote.create({
                    userId: userId,
                    postId: postId,
                    direction: direction,
                });
                voteValue = direction === 'up' ? 1 : -1;
            }

            const post = await db.Post.findByPk(postId);
            if (post) {
                post.voteCount += voteValue;
                await post.save();
            }

            return post;
        } catch (err) {
            return dbException(err);
        }
    },
    async deleteVote(post_id: number) {
        try {
            await db.Vote.destroy({
                where: { postId: post_id },
            });
        } catch (err) {
            return dbException(err);
        }
    },
};

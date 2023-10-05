import { db } from '@/database/index';
import { dbException, customErrorMsg } from '@/exceptions/index';

declare global {
    interface commentsVoteData {
        userId: number;
        commentId: number;
        direction: 'up' | 'down';
    }
}

export const commentsVoteRepository = {
    async vote(voteData: commentsVoteData) {
        const { userId, commentId, direction } = voteData;
        try {
            const existingVote = await db.CommentsVote.findOne({
                where: {
                    userId: userId,
                    commentId: commentId,
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
                await db.CommentsVote.create({
                    userId: userId,
                    commentId: commentId,
                    direction: direction,
                });
                voteValue = direction === 'up' ? 1 : -1;
            }

            const comment = await db.Comments.findByPk(commentId); // Adjust the model name based on your naming
            if (comment) {
                // Assuming you have a voteCount on the CommentModel just like the PostModel
                comment.voteCount += voteValue;
                await comment.save();
            }

            return comment;
        } catch (err) {
            return dbException(err);
        }
    },
};

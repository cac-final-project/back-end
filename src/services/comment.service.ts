import {
    profileRepository,
    commentRepository,
    commentsVoteRepository,
} from '@/repositories/index';
import { customErrorMsg } from '@/exceptions/index';

export const commentService = {
    commentRepository,
    profileRepository,
    commentsVoteRepository,

    async createComment(commentData: CommentsCreateInterface) {
        const { username, user_id } = commentData;
        const profile = await this.profileRepository.getProfile(
            {
                userId: user_id,
            },
            username,
        );
        const profile_img = profile?.profile_img;
        const finalData = { ...commentData, profile_img: profile_img! };
        const comment = await this.commentRepository.create(finalData);
        return comment;
    },

    async commentVote(voteData: commentsVoteData) {
        await this.commentsVoteRepository.vote(voteData);
        return;
    },
};

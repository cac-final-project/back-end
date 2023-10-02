import { db } from '@/database/index';
import { dbException } from '@/exceptions/index';
import { WhereOptions } from 'sequelize';

declare global {
    interface fetchPostsData {
        author?: string;
        type?: 'tip' | 'campaign';
        page?: number;
        limit?: number;
        userId: number;
    }
}

type WhereClause = WhereOptions;

export const postRepository = {
    async createPost(postData: PostCreateInterface) {
        try {
            const tip = await db.Post.create(postData);
            return tip;
        } catch (err) {
            return dbException(err);
        }
    },

    async fetchPosts(fetchData: fetchPostsData): Promise<Post[]> {
        try {
            const { author, type, page = 1, limit = 10, userId } = fetchData;
            console.log(author);
            const offset = (page - 1) * limit;

            const whereClause: WhereClause = {};

            if (type) {
                whereClause.type = type;
            }
            if (author) {
                whereClause.author = author;
            }

            const posts = await db.Post.findAll({
                where: whereClause,
                order: [['voteCount', 'DESC']],
                limit: limit,
                offset: offset,
            });

            const postsWithVotesAndProfileImg = []; // This will hold the posts with the isVoted property and profile_img

            for (let post of posts) {
                const userVote = await db.Vote.findOne({
                    where: {
                        userId: userId,
                        postId: post.id,
                    },
                });

                // Fetching the profile_img based on the post's author
                const user = await db.User.findOne({
                    where: {
                        username: post.author,
                    },
                });

                let profileImg = null;
                if (user) {
                    const profile = await db.Profile.findOne({
                        where: {
                            user_id: user.id,
                        },
                    });
                    if (profile) {
                        profileImg = profile.profile_img;
                    }
                }

                const postData = post.toJSON();
                postData.isVoted = userVote ? userVote.direction : null;
                postData.profile_img = profileImg; // Assign the fetched profile_img

                postsWithVotesAndProfileImg.push(postData);
            }

            return postsWithVotesAndProfileImg;
        } catch (err) {
            return dbException(err);
        }
    },
};

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

            const postsWithVotes = []; // This will hold the posts with the isVoted property

            for (let post of posts) {
                const userVote = await db.Vote.findOne({
                    where: {
                        userId: userId,
                        postId: post.id,
                    },
                });

                const postData = post.toJSON(); // Convert Sequelize instance to plain object
                postData.isVoted = userVote ? userVote.direction : null; // Assign the vote direction if exists or null
                postsWithVotes.push(postData);
            }

            return postsWithVotes;
        } catch (err) {
            return dbException(err);
        }
    },
};

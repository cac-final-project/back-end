import { db } from '@/database/index';
import { dbException } from '@/exceptions/index';
import { WhereOptions } from 'sequelize';

declare global {
    interface fetchPostsData {
        author?: string;
        type?: 'tip' | 'campaign';
        page?: number;
        limit?: number;
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
            const { author, type, page = 1, limit = 10 } = fetchData;
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

            return posts;
        } catch (err) {
            return dbException(err);
        }
    },
};

import { db, defaultOptions } from '@/database/index';
import { dbException, NotFoundException } from '@/exceptions/index';

export const testRepository = {
    async create(userData: UserCreateInterface) {
        try {
            const user = await db.User.create(userData);
            return user;
        } catch (err) {
            return dbException(err);
        }
    },

    async getUser(userId: UserGetInterface) {
        try {
            const user = await db.User.findOne({
                ...defaultOptions,
                where: {
                    id: userId,
                },
            });
            if (!user) {
                return NotFoundException('user');
            }
            return user;
        } catch (err) {
            return dbException(err);
        }
    },
};

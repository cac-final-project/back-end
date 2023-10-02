import { db } from '@/database/index';
import { dbException } from '@/exceptions/index';

export const userRepository = {
    async create(userData: UserCreateInterface) {
        try {
            const user = await db.User.create(userData);
            return user;
        } catch (err) {
            return dbException(err);
        }
    },

    async findByUsername(username: string) {
        try {
            const user = await db.User.findOne({
                where: { username },
            });
            return user;
        } catch (err) {
            return dbException(err);
        }
    },
};

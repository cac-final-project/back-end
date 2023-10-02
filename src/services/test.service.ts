import { testRepository, userRepository } from '@/repositories/index';

export const testService = {
    repository: testRepository,
    userRepository: userRepository,

    async create(userData: UserCreateInterface) {
        const user = await this.repository.create(userData);
        return user;
    },

    async getUser(userId: UserGetInterface) {
        const user = await this.repository.getUser(userId);
        return user;
    },
};

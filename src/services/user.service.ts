import { userRepository } from '@/repositories/index';
import { customErrorMsg } from '@/exceptions/index';
import bcrypt from 'bcrypt';
import { generateToken } from '@/utils/token';

export const userService = {
    userRepository,

    async create(userData: User) {
        userData.password = await bcrypt.hash(userData.password, 10);

        const user = await userRepository.create(userData);
        const extractedData = user.get();

        const token = generateToken({ username: userData.username });
        const res = { ...extractedData, token };
        return res;
    },

    async login(credentials: { username: string; password: string }) {
        // Fetch the user by username
        console.log(credentials);
        const user = await userRepository.findByUserId(credentials.username);

        // If no user found or password doesn't match, throw an error
        if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
            return customErrorMsg('Invalid credentials');
        }
        const token = generateToken({ username: credentials.username });

        const extractedData = user.get() as { [key: string]: any };
        delete extractedData.password; // Remove password from the response

        return { ...extractedData, token };
    },
};

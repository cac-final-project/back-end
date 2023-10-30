import { userRepository, profileRepository } from '@/repositories/index';
import { customErrorMsg } from '@/exceptions/index';
import bcrypt from 'bcrypt';
import { generateToken } from '@/utils/token';

export const userService = {
    userRepository,
    profileRepository,

    async create(userData: User) {
        userData.password = await bcrypt.hash(userData.password, 10);

        const user = await this.userRepository.create(userData);
        const extractedData = user.get();

        const token = generateToken({ username: userData.username });
        const res = { ...extractedData, token };
        return res;
    },

    async login(credentials: { username: string; password: string }) {
        // Fetch the user by username
        console.log(credentials);
        const user = await this.userRepository.findByUsername(
            credentials.username,
        );

        // If no user found or password doesn't match, throw an error
        if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
            return customErrorMsg('Invalid credentials');
        }
        const token = generateToken({ username: credentials.username });

        const extractedData = user.get() as { [key: string]: any };
        delete extractedData.password; // Remove password from the response

        return { ...extractedData, token };
    },

    async checkUsername(username: string) {
        const res = await this.userRepository.findByUsername(username);
        if (res) {
            return true;
        } else {
            return false;
        }
    },

    async sendSms(phone_no: string) {
        let randomNumbers: number[] = [];
        for (let i = 0; i < 6; i++) {
            randomNumbers.push(Math.floor(Math.random() * 10));
        }
        return randomNumbers;
    },
};

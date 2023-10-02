import { profileRepository, userRepository } from '@/repositories/index';
import { customErrorMsg } from '@/exceptions/index';
import { cloudinary } from '@/apis/index';
import fs from 'fs';

export const profileService = {
    profileRepository,
    userRepository,

    async getProfile(profileData: getProfileInterface, username: string) {
        const user = await this.userRepository.findByUserId(username);
        const profile = await this.profileRepository.getProfile(
            profileData,
            username,
        );
        return {
            ...profile,
            first_name: user?.first_name,
            last_name: user?.last_name,
        };
    },

    async updateProfile(profileData: profileUpdateInterface, username: string) {
        // if there is profile_img
        if ('profile_img' in profileData) {
            const { secure_url } = await cloudinary(profileData.profile_img);
            fs.unlinkSync(profileData.profile_img!);
            const updatedProfileData = {
                ...profileData,
                profile_img: secure_url,
            };
            await this.profileRepository.updateProfile(
                updatedProfileData,
                username,
            );
        } // if there is the file is empty (to default img)
        else if ('file' in profileData) {
            const updatedProfileData = {
                ...profileData,
                profile_img: null,
            };
            await this.profileRepository.updateProfile(
                updatedProfileData,
                username,
            );
        } // if user does not want to update profile_img
        else {
            await this.profileRepository.updateProfile(profileData, username);
        }

        return;
    },
};

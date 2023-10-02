import { db } from '@/database/index';
import { dbException } from '@/exceptions/index';

declare global {
    interface getProfileInterface {
        userId: number;
    }

    interface getAuthorProfileInterface {
        username: string;
    }
    interface profileUpdateInterface {
        user_id: number;
        profile_img?: string | null | undefined;
        bio?: string;
        file?: string;
    }
}

export const profileRepository = {
    async getProfile(
        profileData: getProfileInterface,
        username: string,
    ): Promise<Profile | null> {
        const { userId } = profileData;
        console.log('trest', userId);
        try {
            const profile = await db.Profile.findOne({
                where: {
                    user_id: userId, // Use the appropriate foreign key column name in the ProfileModel
                },
            });
            if (profile) {
                return { ...profile.dataValues, username };
            }
            return null;
        } catch (err) {
            throw dbException(err);
        }
    },

    async updateProfile(
        profileData: profileUpdateInterface,
        username: string,
    ): Promise<Profile> {
        const { user_id, ...rest } = profileData;

        const updates = {
            ...('profile_img' in rest ? { profile_img: rest.profile_img } : {}),
            ...('bio' in rest ? { bio: rest.bio } : {}),
        };

        try {
            let profile = await db.Profile.findOne({
                where: {
                    user_id: user_id,
                },
            });

            if (!profile) {
                profile = await db.Profile.create(profileData);
            } else {
                // Update the existing profile
                await profile.update(updates);
            }

            return { ...profile, username };
        } catch (err) {
            throw dbException(err);
        }
    },
};

import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryException } from '@/exceptions/index';

export interface ICloudinaryRes {
    secure_url: string | null;
}

const uploadImageCloud = async (
    img: string | null | undefined,
): Promise<ICloudinaryRes> => {
    try {
        if (img) {
            const { secure_url } = await cloudinary.uploader.upload(img, {
                use_filename: true,
                folder: 'file-upload',
            });
            return { secure_url };
        }
        return {
            secure_url: null,
        };
    } catch (err: any) {
        cloudinaryException(err);
    }
    return {
        secure_url: null,
    };
};

export default uploadImageCloud;

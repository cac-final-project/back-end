import { Router } from 'express';
import { asyncWrapper, customResponse, createRoutes } from '@/common/index';
import { StatusCodes } from 'http-status-codes';
import { createProfileRoutes } from '@/routes/profile.routes';
import { profileService } from '@/services/index';

class ProfileController implements Controller {
    public path = '/profile';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const customRoutes: CustomRoutes = createProfileRoutes(
            this.path,
            this.getProfile,
            this.getAuthorProfile,
            this.updateProfile,
        );
        createRoutes(customRoutes, this.router);
    }

    private getProfile: RequestResponseHandler = asyncWrapper(
        async (req: CustomRequest, res) => {
            const response = customResponse(res);
            const user_id = req.user_id;
            const username = req.username;
            const profile: getProfileInterface = { userId: user_id! };
            try {
                const res = await profileService.getProfile(profile, username!);

                return response.success({
                    code: StatusCodes.CREATED,
                    data: res,
                });
            } catch (err) {
                return response.error(err as ErrorData);
            }
        },
    );

    private getAuthorProfile: RequestResponseHandler = asyncWrapper(
        async (req: CustomRequest, res) => {
            const response = customResponse(res);
            const profile: getAuthorProfileInterface = {
                username: req.body.author!,
            };
            try {
                const res = await profileService.getAuthorProfile(profile);
                return response.success({
                    code: StatusCodes.CREATED,
                    data: res,
                });
            } catch (err) {
                return response.error(err as ErrorData);
            }
        },
    );

    private updateProfile: RequestResponseHandler = asyncWrapper(
        async (req: CustomRequest, res) => {
            const response = customResponse(res);
            const user_id = req.user_id;
            const username = req.username;
            const profile: profileUpdateInterface = { ...req.body, user_id };
            try {
                const res = await profileService.updateProfile(
                    profile,
                    username!,
                );
                return response.success({
                    code: StatusCodes.CREATED,
                    data: res,
                });
            } catch (err) {
                return response.error(err as ErrorData);
            }
        },
    );
}

export default ProfileController;

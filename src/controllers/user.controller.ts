import { Router } from 'express';
import { asyncWrapper, customResponse, createRoutes } from '@/common/index';
import { createUserRoutes } from '@/routes/user.routes';
import { StatusCodes } from 'http-status-codes';
import { userService } from '@/services/index';

type login = {
    username: string;
    password: string;
};

class UserController implements Controller {
    public path = '/user';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const customRoutes: CustomRoutes = createUserRoutes(
            this.path,
            this.create,
            this.login,
            this.validateToken,
            this.checkUsername,
            this.sendSms,
        );
        createRoutes(customRoutes, this.router);
    }

    private create: RequestResponseHandler = asyncWrapper(async (req, res) => {
        const response = customResponse(res);
        const user: User = req.body;
        try {
            const res = await userService.create(user);
            response.success({ code: StatusCodes.CREATED, data: res });
        } catch (err) {
            response.error(err as ErrorData);
        }
    });
    private login: RequestResponseHandler = asyncWrapper(async (req, res) => {
        const response = customResponse(res);
        const user: login = req.body;
        try {
            const res = await userService.login(user);
            response.success({ code: StatusCodes.CREATED, data: res });
        } catch (err) {
            response.error(err as ErrorData);
        }
    });
    private validateToken: RequestResponseHandler = asyncWrapper(
        async (req, res) => {
            const response = customResponse(res);
            try {
                response.success({ code: StatusCodes.OK });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );
    private checkUsername: RequestResponseHandler = asyncWrapper(
        async (req, res) => {
            const response = customResponse(res);
            const payload = req.body;
            try {
                const res = await userService.checkUsername(payload?.username!);
                response.success({ code: StatusCodes.OK, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );

    private sendSms: RequestResponseHandler = asyncWrapper(async (req, res) => {
        const response = customResponse(res);
        const payload = req.body;
        console.log(payload);
        try {
            const res = await userService.sendSms(payload);
            response.success({ code: StatusCodes.OK, data: res });
        } catch (err) {
            response.error(err as ErrorData);
        }
    });
}

export default UserController;

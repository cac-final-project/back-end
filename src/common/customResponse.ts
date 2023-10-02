import { StatusCodes } from 'http-status-codes';
import { Response, Request } from 'express';

declare global {
    interface SuccessData {
        code: number;
        data?: any;
        message?: string;
    }

    interface ErrorData {
        code: number;
        message: string;
        error?: any;
        data?: any;
    }

    interface CustomRequest extends Request {
        token?: string;
        username?: string;
        user_id?: number;
    }
}

export const customResponse = (res: Response) => {
    return {
        success({ code = StatusCodes.OK, data, message }: SuccessData) {
            return res.status(code).json({ result: true, code, data, message });
        },
        error({ code, message, error, data }: ErrorData) {
            return res
                .status(code)
                .json({ result: false, code, message, error, data });
        },
    };
};

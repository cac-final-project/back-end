import { StatusCodes } from 'http-status-codes';

export const dbException = (error: any) => {
    throw {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'something wrong with the server',
        error,
    };
};

export const customErrorMsg = (error: any) => {
    throw {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'something wrong with the server',
        error,
    };
};

export const NotFoundException = (table_name: string) => {
    throw {
        code: StatusCodes.NOT_FOUND,
        message: `${table_name} does not exist`,
    };
};

export const cloudinaryException = (error: any) => {
    throw {
        code: StatusCodes.BAD_REQUEST,
        message: 'something wrong with cloudinary',
        error: 'invalid file',
    };
};

import jwt from 'jsonwebtoken';
import { customErrorMsg } from '@/exceptions/index';

export const generateToken = (payload: any): string => {
    return jwt.sign(payload, String(process.env.Token_SECRET), {
        expiresIn: '1h',
    });
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, String(process.env.Token_SECRET));
    } catch (error) {
        return customErrorMsg('Invalid token');
    }
};

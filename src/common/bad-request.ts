import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-error';

class BadRequest extends CustomAPIError {
    public errors: string[];

    constructor(message: string, errors: string[]) {
        super(message, StatusCodes.BAD_REQUEST);
        this.errors = errors;
    }
}

export default BadRequest;

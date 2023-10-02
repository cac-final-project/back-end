import { queryValidation, validateToken } from '@/middlewares/index';
import {
    geocoding_validation,
    get_emergencyData_validation,
} from '@/validations/index';

export function createWeatherRoutes(
    path: string,
    getEmergencyDataHandler: RequestResponseHandler,
): CustomRoutes {
    return {
        create: {
            method: 'get',
            path: `${path}`,
            middleware: [
                validateToken(),
                queryValidation(get_emergencyData_validation),
            ],
            handler: getEmergencyDataHandler,
        },
    };
}

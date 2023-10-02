import { queryValidation, validateToken } from '@/middlewares/index';
import {
    geocoding_validation,
    get_emergencyData_validation,
} from '@/validations/index';

export function createGeoRoutes(
    path: string,
    geolocationHandler: RequestResponseHandler,
): CustomRoutes {
    return {
        geolocation: {
            method: 'get',
            path: `${path}`,
            middleware: [
                // validateToken(),
                queryValidation(geocoding_validation),
            ],
            handler: geolocationHandler,
        },
    };
}

import { geolocation, googleGeoLocation } from '@/apis/index';
import { countyRepository } from '@/repositories/index';
import { customErrorMsg } from '@/exceptions/index';

declare global {
    interface geoData {
        lat: string;
        lon: string;
    }
}

export const geoService = {
    countyRepository,

    async geolocation(geoData: geoData) {
        return await geolocation(geoData);
        return await googleGeoLocation(geoData);
    },
};

import { geolocation, googleGeoLocation } from '@/apis/index';
import { countyRepository } from '@/repositories/index';
import { customErrorMsg } from '@/exceptions/index';

declare global {
    interface weatherData {
        county: string;
    }
}

export const weatherService = {
    countyRepository,

    async geoEmergency(weatherData: weatherData) {
        // when front gives county, we filter the emergency data from national weather service api
        return;
    },
};

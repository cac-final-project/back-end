import axios from 'axios';
import { customErrorMsg } from '@/exceptions/index';

const GOOGLE_MAPS_API_ENDPOINT =
    'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Remember to replace with your API key

const googleGeoLocation = async (geoData: geoData): Promise<string | null> => {
    try {
        const { lat, lon } = geoData;
        const response = await axios.get(GOOGLE_MAPS_API_ENDPOINT, {
            params: {
                latlng: `${lat},${lon}`,
                key: API_KEY,
            },
        });

        const results: any[] = response.data.results;
        console.log(results);
        return extractNeighborhood(results);
    } catch (error) {
        throw customErrorMsg(`Error fetching neighborhood`);
    }
};

const extractNeighborhood = (results: any[]): string | null => {
    for (const result of results) {
        const neighborhoodComponent = result.address_components.find(
            (component: any) => component.types.includes('neighborhood'),
        );

        if (neighborhoodComponent) {
            return neighborhoodComponent.long_name;
        }
    }
    return null;
};

export default googleGeoLocation;

import axios from 'axios';
import { customErrorMsg } from '@/exceptions/index';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/reverse';

const geolocation = async (geoData: geoData): Promise<string> => {
    const { lat, lon } = geoData;
    try {
        const response = await axios.get(NOMINATIM_BASE_URL, {
            params: {
                format: 'json',
                lat: lat,
                lon: lon,
                zoom: 18,
                addressdetails: 1,
            },
            headers: {
                'User-Agent': 'YOUR_APP_NAME (YOUR_CONTACT_EMAIL)', // Nominatim requires a valid User-Agent header
            },
        });

        // Check if the neighborhood exists in the address, if not, return the city
        // If the city doesn't exist, return the county
        console.log(response.data);
        const address = response.data.address;
        // return address.neighbourhood || address.city || address.county;
        return address;
    } catch (error) {
        throw customErrorMsg('reverse geocoding error');
    }
};

export default geolocation;

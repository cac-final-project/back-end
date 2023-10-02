import axios from 'axios';
import { customErrorMsg } from '@/exceptions/index';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export const getAddressFromLatLon = async (
    lat: number,
    lon: number,
): Promise<string | null> => {
    try {
        const response = await axios.get(NOMINATIM_URL, {
            params: {
                format: 'json',
                lat: lat,
                lon: lon,
                zoom: 18,
            },
        });

        return response.data?.address?.road || null;
    } catch (error) {
        return customErrorMsg(`Error fetching neighborhood`);
    }
};

import axios from 'axios';

export const fetchWeatherAlerts = async (state: any) => {
    const apiUrl = `https://api.weather.gov/alerts/active?area=${state}`;
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather alerts:', error);
        throw error;
    }
};

// export const extractUGCCodes = (data) => {
//     const ugcCodes = [];
//     if (data && data.features && data.features.length) {
//         for (let feature of data.features) {
//             const ugc = feature.properties.geocode.UGC;
//             ugcCodes.push(...ugc);
//         }
//     }
//     return ugcCodes;
// };

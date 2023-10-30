import axios from 'axios';
import { customErrorMsg } from '@/exceptions/index';
import { getAddressFromLatLon } from './geocoding_resources';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

interface Tag {
    [key: string]: string;
}

interface AmenityItem {
    type: string;
    id: number;
    lat: number;
    lon: number;
    address: string;
    tags: Tag;
    distance?: number;
    amenity?: string;
}

const TAG_CONFIG = {
    ignore: [
        'colour',
        'material',

        'seats',
        'toilets:disposal',
        'operator',
        'name',
        'source',
        'inscription',
        'supervised',
        'level',
        'portable',
        'bottle',
        'barrier',
        'access',
    ],
    rename: {
        fee: 'free',
        check_date: 'recently_checked',
        'toilets:handwashing': 'handwashing',
    },
};

function getDistanceFromLatLonInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1000;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

async function fetchResources(resourceData: {
    lat: number;
    lon: number;
}): Promise<any> {
    const { lat, lon } = resourceData;
    const offset = 0.05;
    const south = lat - offset;
    const west = lon - offset;
    const north = lat + offset;
    const east = lon + offset;

    const amenities = ['drinking_water', 'toilets', 'shower', 'bench'];
    const queries = amenities
        .map(
            (amenity) => `
            node["amenity"="${amenity}"](${south},${west},${north},${east});
            relation["amenity"="${amenity}"](${south},${west},${north},${east});
        `,
        )
        .join('');

    const fullQuery = `
        [out:json];
        (
          ${queries}
        );
        out body;
        >;
        out skel qt;
    `;
    //      const limit = 20; // Change this to your desired limit
    //      const fullQuery = `
    //     [out:json];
    //     (
    //       ${queries}
    //     );
    //     out body ${limit};
    //     >;
    //     out skel qt;
    // `;

    try {
        const response = await axios.post(
            OVERPASS_API_URL,
            'data=' + encodeURIComponent(fullQuery),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );

        let refinedData = response.data.elements;

        // First compute distance for all items
        for (const item of refinedData) {
            item.distance = getDistanceFromLatLonInMeters(
                lat,
                lon,
                item.lat,
                item.lon,
            );
        }

        // Sort items by amenity type and then by distance
        refinedData.sort((a: AmenityItem, b: AmenityItem) => {
            if (a.tags?.amenity !== b.tags?.amenity) {
                return a.tags?.amenity.localeCompare(b.tags?.amenity);
            }
            return (a.distance || 0) - (b.distance || 0);
        });

        const limitedData: AmenityItem[] = [];
        const amenityCount: { [key: string]: number } = {};

        for (const item of refinedData) {
            const amenity = item.tags?.amenity;
            if (amenity) {
                amenityCount[amenity] = (amenityCount[amenity] || 0) + 1;
                if (amenityCount[amenity] <= 3) {
                    limitedData.push(item);
                }
            }
        }

        refinedData = limitedData.filter(
            (item: AmenityItem) => item.type !== 'way',
        );

        for (let item of refinedData) {
            if (!item.tags) {
                for (const amenity of amenities) {
                    if (fullQuery.includes(`["amenity"="${amenity}"]`)) {
                        item.tags = { amenity: amenity };
                        break;
                    }
                }
            }

            for (const key in item.tags) {
                if (TAG_CONFIG.ignore.includes(key)) {
                    delete item.tags[key];
                } else if (
                    TAG_CONFIG.rename[key as keyof typeof TAG_CONFIG.rename]
                ) {
                    item.tags[
                        TAG_CONFIG.rename[key as keyof typeof TAG_CONFIG.rename]
                    ] = item.tags[key];
                    delete item.tags[key];
                }
            }
        }

        const allTags = new Set<string>();
        const uniqueAmenities = new Set<string>();
        for (const item of refinedData) {
            if (item.tags.amenity) {
                uniqueAmenities.add(item.tags.amenity);
            }
            for (const key in item.tags) {
                if (key !== 'amenity') {
                    allTags.add(key);
                }
            }
            item.address = 'asdfsadf';
            // item.address = await getAddressFromLatLon(item.lat, item.lon);
        }

        refinedData = refinedData.map((item: AmenityItem) => ({
            type: item.type,
            id: item.id,
            lat: item.lat,
            lon: item.lon,
            address: item.address, // Add this line
            amenity: item.tags.amenity,
            tags: Object.keys(item.tags).filter((tag) => tag !== 'amenity'),
            distance: getDistanceFromLatLonInMeters(
                lat,
                lon,
                item.lat,
                item.lon,
            ),
        }));

        refinedData.sort(
            (a: AmenityItem, b: AmenityItem) =>
                (a.distance || 0) - (b.distance || 0),
        );

        return {
            tags: Array.from(allTags),
            amenities: Array.from(uniqueAmenities),
            data: refinedData,
        };
    } catch (error) {
        return customErrorMsg('error when fetching resources');
    }
}

export default fetchResources;

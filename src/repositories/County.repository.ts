import { db } from '@/database/index';
import { dbException } from '@/exceptions/index';
import axios from 'axios';

export const countyRepository = {
    async isCountyTableEmpty(): Promise<boolean> {
        try {
            const count = await db.County.count();
            return count === 0;
        } catch (err) {
            throw dbException(err);
        }
    },
    async create() {
        try {
            const response = await axios.get(
                'https://www.weather.gov/source/gis/Shapefiles/County/bp08mr23.dbx',
            );

            // Assuming the response is a string with each line representing a county.
            const lines = response.data
                .split('\n')
                .filter((line: string) => line.trim() !== '');

            const counties = lines.map((line: string) => {
                const [
                    state,
                    zone,
                    cwa,
                    name,
                    state_zone,
                    county,
                    fips,
                    time_zone,
                    fe_area,
                    lat,
                    lon,
                ] = line.split('|');

                return {
                    state,
                    zone,
                    cwa,
                    name,
                    state_zone,
                    county,
                    fips,
                    time_zone,
                    fe_area,
                    lat: parseFloat(lat),
                    lon: parseFloat(lon),
                };
            });

            // Insert into DB
            await db.County.bulkCreate(counties);
        } catch (err) {
            return dbException(err);
        }
    },
    async getTexasCounties(): Promise<County[]> {
        try {
            const texasCounties = await db.County.findAll({
                where: {
                    state: 'TX',
                },
            });
            return texasCounties;
        } catch (err) {
            throw dbException(err);
        }
    },

    // async findCountyNameByUGC(ugc) {
    //     try {
    //         const county = await db.County.findOne({
    //             where: {
    //                 UGC: ugc,
    //             },
    //             attributes: ['name'],
    //         });

    //         if (county) {
    //             return county.name;
    //         } else {
    //             throw new Error(`County not found for UGC: ${ugc}`);
    //         }
    //     } catch (err) {
    //         throw dbException(err);
    //     }
    // },
};

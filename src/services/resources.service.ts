import { fetchResources } from '@/apis/index';
import { countyRepository } from '@/repositories/index';
import { customErrorMsg } from '@/exceptions/index';

declare global {
    interface resourceData {
        lat: number;
        lon: number;
    }
}

export const resourcesService = {
    countyRepository,

    async findResources(resourceData: resourceData) {
        return await fetchResources(resourceData);
    },
};

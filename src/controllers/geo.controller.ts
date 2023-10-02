import { Router } from 'express';
import { asyncWrapper, customResponse, createRoutes } from '@/common/index';
import { createGeoRoutes } from '@/routes/geo.routes';
import { StatusCodes } from 'http-status-codes';
import { geoService } from '@/services/index';

class GeoController implements Controller {
    public path = '/geo';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const customRoutes: CustomRoutes = createGeoRoutes(
            this.path,
            this.geolocation,
        );
        createRoutes(customRoutes, this.router);
    }

    private geolocation: RequestResponseHandler = asyncWrapper(
        async (req, res) => {
            const response = customResponse(res);
            const geoData: geoData = req.body;
            try {
                const res = await geoService.geolocation(geoData);
                return response.success({
                    code: StatusCodes.CREATED,
                    data: res,
                });
            } catch (err) {
                return response.error(err as ErrorData);
            }
        },
    );
}

export default GeoController;

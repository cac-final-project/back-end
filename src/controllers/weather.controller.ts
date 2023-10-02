import { Router } from 'express';
import { asyncWrapper, customResponse, createRoutes } from '@/common/index';
import { createWeatherRoutes } from '@/routes/weather.routes';
import { StatusCodes } from 'http-status-codes';
import { weatherService } from '@/services/index';

class WeatherController implements Controller {
    public path = '/weather';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const customRoutes: CustomRoutes = createWeatherRoutes(
            this.path,
            this.getEmergencyData,
        );
        createRoutes(customRoutes, this.router);
    }

    private getEmergencyData: RequestResponseHandler = asyncWrapper(
        async (req, res) => {
            const response = customResponse(res);
            // const user: User = req.body;
            try {
                // const res = await weatherService.create(user);
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );
}

export default WeatherController;

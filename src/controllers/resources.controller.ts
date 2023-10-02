import { Router } from 'express';
import { asyncWrapper, customResponse, createRoutes } from '@/common/index';
import { createResourcesRoutes } from '@/routes/resources.routes';
import { StatusCodes } from 'http-status-codes';
import { resourcesService } from '@/services/index';

class ResourcesController implements Controller {
    public path = '/resources';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const customRoutes: CustomRoutes = createResourcesRoutes(
            this.path,
            this.findResources,
        );
        createRoutes(customRoutes, this.router);
    }

    private findResources: RequestResponseHandler = asyncWrapper(
        async (req, res) => {
            const response = customResponse(res);
            const resourceData: resourceData = req.body;
            try {
                const res = await resourcesService.findResources(resourceData);
                response.success({ code: StatusCodes.CREATED, data: res });
            } catch (err) {
                response.error(err as ErrorData);
            }
        },
    );
}

export default ResourcesController;

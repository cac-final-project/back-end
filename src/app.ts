import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { morganMiddleware } from '@/utils/index';
import { errorMiddleware } from '@/middlewares/index';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { v2 as cloudinary } from 'cloudinary';
import db from '@/database/db';
import { countyRepository } from '@/repositories/index';

interface IAppParamters {
    controllers: Controller[];
}

class App {
    public express: Application;
    public port: number = Number(process.env.PORT);

    constructor({ controllers }: IAppParamters) {
        this.express = express();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
        this.initializeCloudinary();
    }

    private initializeMiddleware() {
        this.express.use(helmet());
        this.express.use(cors({ origin: '*' }));
        this.express.use(morganMiddleware);
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.set('trust proxy', 1);
        this.express.use(
            rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 100,
            }),
        );
        this.express.use(compression());
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initializeErrorHandling(): void {
        this.express.use(errorMiddleware);
    }

    private initializeCloudinary(): void {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        });
    }

    public async uploadCountyDataToDB(): Promise<void> {
        const isEmpty = await countyRepository.isCountyTableEmpty();
        if (isEmpty) {
            await countyRepository.create();
        }
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }

    public bootstrap() {
        db.sequelize
            .authenticate()
            .then(() => {
                return db.sequelize.sync({ force: false });
            })
            .then(() => this.listen())
            .catch((error) => console.log(error));
    }
}
export default App;

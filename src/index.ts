import 'source-map-support/register';
import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import { validateEnv } from '@/utils/index';
import { controllers } from '@/controllers/index';
import { fetchWaterData } from './test'; // add this line

validateEnv();

const app = new App({
    controllers: [...controllers],
});

// fetchWaterData();

app.bootstrap();
// app.uploadCountyDataToDB();

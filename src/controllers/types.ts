import { Router } from 'express';

declare global {
    interface Controller {
        path: string;
        router: Router;
    }
}

export {};

declare global {
    type CustomRoutes = {
        [key: string]: IRouteOptions;
    };
}

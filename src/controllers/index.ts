import UserController from './user.controller';
import TestController from './test.controller';
import PostController from './post.controller';
import ProfileController from './profile.controller';
import WeatherController from './weather.controller';
import GeoController from './geo.controller';
import ResourcesController from './resources.controller';
import CommentController from './comment.controller';

export const controllers = [
    new UserController(),
    new TestController(),
    new PostController(),
    new ProfileController(),
    new WeatherController(),
    new GeoController(),
    new ResourcesController(),
    new CommentController(),
];

import { Express } from 'express';
import initApiUser from './apiUser';
import initApiCourse from './apiCourse';
import initApiAllCode from './apiAllCode';
import initCalenderRouter from './apiCalendar';

const initApiRoutes = (app: Express) => {
    initApiUser(app);
    initApiCourse(app);
    initApiAllCode(app);
    initCalenderRouter(app);
};

export default initApiRoutes;

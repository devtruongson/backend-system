import { Express } from "express";
import initApiUser from "./apiUser";
import initApiCourse from "./apiCourse";

const initApiRoutes = (app : Express ) => {
    initApiUser(app);
    initApiCourse(app);
}

export default initApiRoutes;

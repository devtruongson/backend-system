import { Express } from "express";
import initApiUser from "./apiUser";

const initApiRoutes = (app : Express ) => {
    initApiUser(app);
}

export default initApiRoutes;

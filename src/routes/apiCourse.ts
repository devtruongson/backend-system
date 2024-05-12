import express , { Express }from "express";
import courseController from "~/controller/courseController";


const router = express.Router();

const initApiCourse = (app :Express ) => {

    router.get('/get-course',courseController.handleGetCourse)

    return app.use("/v1", router);
}

export default initApiCourse;
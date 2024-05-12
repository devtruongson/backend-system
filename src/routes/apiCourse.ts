import express , { Express }from "express";
import courseController from "~/controller/courseController";
import { handleCheckTokenAdmin } from "~/middleware/jwtActions";


const router = express.Router();

const initApiCourse = (app :Express ) => {

    router.post("/create", courseController.handleCreateCoure)

    router.delete("/delete" , handleCheckTokenAdmin , courseController.handleDeleteCourse)

    router.get('/get',courseController.handleGetCourse)

    return app.use("/v1/course", router);
}

export default initApiCourse;
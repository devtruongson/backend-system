import express , { Express }from "express";
import userController from "~/controller/userController";

const router = express.Router();

const initApiUser = (app :Express ) => {
    router.get('/get-user' , userController.handleGet)

    router.post("/create-user"  , userController.handleCreateUser)

    return app.use("/v1", router);
}

export default initApiUser;

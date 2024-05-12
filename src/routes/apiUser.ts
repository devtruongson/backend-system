import express , { Express }from "express";
import userController from "~/controller/userController";
import { handleCheckTokenUser } from "~/middleware/jwtActions";

const router = express.Router();

const initApiUser = (app :Express ) => {

    router.post("/login",handleCheckTokenUser, userController.handleLogin)

    router.get('/get-user' , userController.handleGet)

    router.post("/create-user"  , userController.handleCreateUser)

    return app.use("/v1", router);
}

export default initApiUser;

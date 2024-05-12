import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CreateUserDto } from '~/dto/createUser.dto';
import userService from '~/service/userService';
import { validateData } from '~/utils/validate';

class UserController {
    async handleGet(req: Request, res: Response) {
        return res.status(200).json('run');
    }

    async handleCreateUser(req: Request, res: Response) {
        try {
            await validateData(CreateUserDto, req.body, res);
            const data = await userService.createUserService(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res.status(500).json('Err server');
        }
    }

    async handleLogin(req: Request, res: Response) {
        try {
            res.status(200).json('run');
        } catch (err) {
            console.log(err);
            return res.status(500).json('err server');
        }
    }
}

const userController = new UserController();
export default userController;

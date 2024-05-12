import { Request, Response } from 'express';
import userService from '~/service/userService';

class UserController {
    async handleGet(req: Request, res: Response) {
        return res.status(200).json('a');
    }

    async handleCreateUser(req: Request, res: Response) {
        try {
            userService.createUserService();
            return res.status(200).json();
        } catch (err) {
            console.log(err);
            return res.status(500).json('err server');
        }
    }
}

export default new UserController();

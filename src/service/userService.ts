import httpStatus from 'http-status';
import User from '~/models/User';
import { IUser } from '~/utils/interface';
import { ResponseHandler } from '~/utils/Response';

class UserService {
    async createUserService(body: IUser) {
        try {
            const isUserExits = await this.checkUserExit(body.email);

            if (isUserExits) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'User already exists');
            }
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async checkUserExit(email: string): Promise<boolean> {
        let isValid = true;
        const user = await User.findOne({
            where: {
                email,
            },
        });

        if (user) {
            isValid = false;
        }
        return isValid;
    }
}

export default new UserService();
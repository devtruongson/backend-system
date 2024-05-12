import httpStatus from 'http-status';
import { sequelize } from '~/configs/connectDB';
import { loginDto } from '~/dto/login.dto';
import { comparePassword, endCodePassword } from '~/helpers/bcrypt';
import { handleCreateToken } from '~/middleware/jwtActions';
import AllCode from '~/models/AllCode';
import User from '~/models/User';
import { IUser } from '~/utils/interface';
import { ResponseHandler } from '~/utils/Response';

class UserService {
    async createUserService(body: IUser) {
        try {
            const isUserExits = await this.checkUserExit(body.email, 'check');
            if (isUserExits) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'User already exists');
            }

            const passwordHash = await endCodePassword(body.password);
            const user = User.create({
                ...body,
                password: passwordHash,
            });
            return ResponseHandler(httpStatus.OK, user, 'User create successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async loginUser(body: loginDto) {
        try {
            const dataCheck = await this.checkUserExit(body.email, 'query');
            if (typeof dataCheck !== 'object')
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            if (!dataCheck.User) {
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            }

            if (!dataCheck.isValid) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'User not exists');
            }

            const checkPassword = await comparePassword(body.password, dataCheck.User.password);
            const tokenAccess = handleCreateToken(
                {
                    id: dataCheck.User.id,
                    email: dataCheck.User.email,
                    phoneNumber: dataCheck.User.phoneNumber,
                    is_login_social: dataCheck.User.is_login_social,
                    role: dataCheck.User.role,
                    role_detail: '',
                },
                '30day',
            );
            const tokenRefresh = handleCreateToken(
                {
                    id: dataCheck.User.id,
                    email: dataCheck.User.email,
                    phoneNumber: dataCheck.User.phoneNumber,
                    is_login_social: dataCheck.User.is_login_social,
                    role: dataCheck.User.role,
                    role_detail: '',
                },
                '360day',
            );

            if (checkPassword) {
                return ResponseHandler(
                    httpStatus.OK,
                    {
                        user: dataCheck.User,
                        tokens: {
                            access_token: tokenAccess,
                            refresh_token: tokenRefresh,
                        },
                    },
                    'User login successfully',
                );
            } else {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Wrong password');
            }
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async checkUserExit(
        email: string,
        type: 'check' | 'query' = 'check',
    ): Promise<
        | boolean
        | {
              User: IUser | null;
              isValid: boolean;
          }
    > {
        let isValid = false;
        const user = (await User.findOne({
            where: {
                email,
            },
            include: [
                {
                    model: AllCode,
                    as: 'roleData',
                    attributes: ['type', 'title', 'code'],
                },
            ],
        })) as IUser | null;

        /* 
        (await User.findOne({
            where: {
                email,
            },
            include: [{ model: AllCode, as: 'roleData' }],
        })) as IUser | null;
        */

        if (user) {
            isValid = true;
        }

        return type !== 'check'
            ? {
                  User: user,
                  isValid: isValid,
              }
            : isValid;
    }
}

export default new UserService();
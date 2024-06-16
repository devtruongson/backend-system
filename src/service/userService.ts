import httpStatus from 'http-status';
import { Op } from 'sequelize';
import { sequelize } from '~/configs/connectDB';
import { loginDto } from '~/dto/login.dto';
import { comparePassword, endCodePassword } from '~/helpers/bcrypt';
import { handleCreateToken } from '~/middleware/jwtActions';
import AllCode from '~/models/AllCode';
import Calendar from '~/models/Calendar';
import CalendarTeacher from '~/models/CalendarTeacher';
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

    async handleCreateUserBulk(body: IUser[]) {
        try {
            const data = await Promise.all(
                await body.map(async (user) => {
                    return {
                        ...user,
                        password: await endCodePassword(user.password),
                    };
                }),
            );

            const user = User.bulkCreate(
                data.map((item) => {
                    return {
                        ...item,
                    };
                }),
            );
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

            console.log(dataCheck);
            const tokenAccess = handleCreateToken(
                {
                    id: dataCheck.User.id,
                    email: dataCheck.User.email,
                    phoneNumber: dataCheck.User.phoneNumber,
                    is_login_social: dataCheck.User.is_login_social,
                    role: dataCheck.User.role,
                    role_detail: dataCheck.User?.roleData?.code || 'USER',
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
                    role_detail: dataCheck.User?.roleData?.code || 'USER',
                },
                '360day',
            );
            const user = {
                ...dataCheck.User,
            } as any;
            delete user.password;

            if (checkPassword) {
                return ResponseHandler(
                    httpStatus.OK,
                    {
                        user: user,
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

    async getAllUsers(data: any) {
        try {
            let offset: number = (data.page - 1) * data.pageSize;

            let { count, rows }: { count: number; rows: any } = await User.findAndCountAll({
                where: {
                    role: data.role,
                },
                include: [
                    {
                        model: AllCode,
                        as: 'roleData',
                        attributes: ['type', 'title', 'code'],
                    },
                    {
                        model: AllCode,
                        as: 'addressData',
                        attributes: ['type', 'title', 'code'],
                    },
                ],
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt'],
                },
                offset: offset,
                limit: +data.pageSize,
            });

            let query: any = {
                [Op.eq]: data.day ? data.day : new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
            };

            if (data.isAll) {
                query = {
                    [Op.gte]: data.day ? data.day : new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
                };
            }
            const dataRes = await Promise.all(
                await rows.map(async (row: any) => {
                    const countCalendar = await CalendarTeacher.count({
                        where: {
                            teacher_id: row.id,
                            day: {
                                ...query,
                            },
                        },
                    });

                    const calendarData = await CalendarTeacher.findAll({
                        where: {
                            teacher_id: row.id,
                            day: {
                                [Op.gte]: data.day ? data.day : new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
                            },
                        },
                        include: [
                            {
                                model: Calendar,
                                as: 'calendarData',
                            },
                        ],
                    });

                    return {
                        ...row.toJSON(),
                        countCalendar,
                        calendarData,
                        listTimeBooked: calendarData.map((item: any) => item.time_stamp_start),
                    };
                }),
            );

            let resData = {
                items: dataRes,
                meta: {
                    currentPage: data.page,
                    totalIteams: count,
                    totalPages: Math.ceil(count / data.pageSize),
                },
            };
            return ResponseHandler(httpStatus.OK, resData, 'ok');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async getAllUsersByType(type: string) {
        try {
            const users = await User.findAll({
                where: {
                    role: +type,
                },
                include: [
                    {
                        model: AllCode,
                        as: 'roleData',
                        attributes: ['type', 'title', 'code'],
                    },
                    {
                        model: AllCode,
                        as: 'addressData',
                        attributes: ['type', 'title', 'code'],
                    },
                ],
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt'],
                },
            });

            return ResponseHandler(httpStatus.OK, users, 'ok');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async getOneUser(id: number) {
        try {
            const user = await User.findOne({
                where: {
                    id,
                },
                include: [
                    {
                        model: AllCode,
                        as: 'roleData',
                        attributes: ['type', 'title', 'code'],
                    },
                    {
                        model: AllCode,
                        as: 'addressData',
                        attributes: ['type', 'title', 'code'],
                    },
                ],
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt'],
                },
                raw: true,
                nest: true,
            });
            if (!user) {
                return ResponseHandler(httpStatus.BAD_REQUEST, {}, 'not found');
            } else {
                return ResponseHandler(httpStatus.OK, user, 'ok');
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
            raw: true,
            nest: true,
        })) as IUser | null;

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

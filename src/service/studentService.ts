import httpStatus from 'http-status';
import { studentDto } from '~/dto/createStudent.dto';
import { loginDto } from '~/dto/login.dto';
import { comparePassword, endCodePassword } from '~/helpers/bcrypt';
import { handleRemoveFile } from '~/helpers/handleRemoveImg';
import { handleCreateToken } from '~/middleware/jwtActions';
import AllCode from '~/models/AllCode';
import Parent from '~/models/Parent';
import Student from '~/models/Student';

import { ResponseHandler } from '~/utils/Response';

class studentService {
    async checkStudentExit(
        email: string,
        type: 'check' | 'query' = 'check',
    ): Promise<
        | boolean
        | {
              Student: studentDto | null;
              isValid: boolean;
          }
    > {
        let isValid = false;
        const student = (await Student.findOne({
            where: {
                email,
            },
            include: [
                {
                    model: AllCode,
                    as: 'AllCodeData',
                    attributes: ['type', 'title', 'code'],
                },
                {
                    model: Parent,
                    as: 'ParentData',
                    attributes: ['id', 'fullName', 'association_for_student'],
                    include: [
                        {
                            model: AllCode,
                            as: 'AssociationData',
                            attributes: ['type', 'title', 'code'],
                        },
                    ],
                },
            ],
            raw: true,
            nest: true,
        })) as studentDto | null;

        if (student) {
            isValid = true;
        }

        return type !== 'check'
            ? {
                  Student: student,
                  isValid: isValid,
              }
            : isValid;
    }

    // REGISTER

    async createStudentService(data: studentDto) {
        try {
            let checkExit = await this.checkStudentExit(data.email);

            if (checkExit) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'User already exists');
            }

            const passwordHash = await endCodePassword(data.password);

            console.log(passwordHash);

            const student = Student.create({
                ...data,
                password: passwordHash,
            });

            return ResponseHandler(httpStatus.OK, student, 'Create Student Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // LOGIN

    async loginStudentService(data: loginDto) {
        try {
            const dataCheck = await this.checkStudentExit(data.email, 'query');

            if (typeof dataCheck !== 'object')
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            if (!dataCheck.Student) {
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            }

            if (!dataCheck.isValid) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'User not exists');
            }

            const checkPassword = await comparePassword(data.password, dataCheck.Student.password);

            if (!checkPassword) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Wrong password');
            }

            const user = {
                ...dataCheck.Student,
            } as any;

            delete user.password;

            const tokenAccess = handleCreateToken(
                {
                    id: dataCheck.Student.id,
                    email: dataCheck.Student.email,
                    phoneNumber: dataCheck.Student.phoneNumber,
                    is_login_social: false,
                    role: dataCheck.Student.address,
                    role_detail: 'USER',
                },
                '30day',
            );

            const tokenRefresh = handleCreateToken(
                {
                    id: dataCheck.Student.id,
                    email: dataCheck.Student.email,
                    phoneNumber: dataCheck.Student.phoneNumber,
                    is_login_social: false,
                    role: dataCheck.Student.address,
                    role_detail: 'USER',
                },
                '360day',
            );

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
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //UPDATE

    async updateStudentService(data: studentDto) {
        try {
            let student = await this.checkStudentExit(data.email, 'query');

            if (typeof student !== 'object')
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            if (!student.Student) {
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            }

            if (student.Student.avatar && data.avatar && !handleRemoveFile(student.Student.avatar, 'studentAvatar')) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, "Can't remove avatar old");
            }

            await Student.update(
                {
                    ...data,
                    password: student.Student.password,
                },
                {
                    where: { email: data.email },
                },
            );

            return ResponseHandler(httpStatus.OK, null, 'Update Student Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new studentService();

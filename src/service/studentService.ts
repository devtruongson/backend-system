import httpStatus from 'http-status';
import { studentDto } from '~/dto/createStudent.dto';
import { loginDto } from '~/dto/login.dto';
import { comparePassword, endCodePassword } from '~/helpers/bcrypt';
import { handleCreateToken } from '~/middleware/jwtActions';
import AllCode from '~/models/AllCode';
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
                    as: 'address',
                    attributes: ['type', 'title', 'code'],
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

    // CREATE

    async createStudentService(data: studentDto) {
        try {
            let checkExit = await this.checkStudentExit(data.email);

            if (checkExit) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'User already exists');
            }

            const passwordHash = await endCodePassword(data.password);

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
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // GET ALL

    async getAllStudentService() {
        try {
            return ResponseHandler(httpStatus.OK, null, '');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // GET LIMIT

    async getStudentService() {
        try {
            return ResponseHandler(httpStatus.OK, null, '');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //DELETE

    async deleteStudentService() {
        try {
            return ResponseHandler(httpStatus.OK, null, '');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //UPDATE

    async updateStudentService() {
        try {
            return ResponseHandler(httpStatus.OK, null, '');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new studentService();

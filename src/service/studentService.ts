import httpStatus from 'http-status';
import { studentDto } from '~/dto/createStudent.dto';
import Student from '~/models/Student';

import { ResponseHandler } from '~/utils/Response';

class studentService {
    async handleCheckCodeExit(email: string, type: 'check' | 'query' = 'check'): Promise<boolean | studentDto | null> {
        let isCheck = false;

        let course = (await Student.findOne({
            where: { email: email },
        })) as studentDto | null;
        if (course) {
            isCheck = true;
        }

        return type === 'check' ? isCheck : course;
    }

    // CREATE

    async createStudentService(data: studentDto) {
        try {
            return ResponseHandler(httpStatus.OK, null, '');
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

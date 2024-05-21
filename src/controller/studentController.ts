import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { studentDto } from '~/dto/createStudent.dto';
import { loginDto } from '~/dto/login.dto';
import studentService from '~/service/studentService';
import { ResponseHandler } from '~/utils/Response';
import { validateData } from '~/utils/validate';

class studentController {
    // REGISTER

    async handleCreateStudent(req: Request, res: Response) {
        try {
            const isValid = await validateData(studentDto, req.body, res);
            if (!isValid) return;

            const data = await studentService.createStudentService(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    // LOGIN

    async handleLoginStudent(req: Request, res: Response) {
        try {
            const isValid = await validateData(loginDto, req.body, res);
            if (!isValid) return;

            const data = await studentService.loginStudentService(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //UPDATE

    async handleUpdateStudent(req: Request, res: Response) {
        try {
            let isValid = await validateData(studentDto, req.body, res);
            if (!isValid) return;

            let data = await studentService.updateStudentService(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    async handleGetInfoStudent(req: Request, res: Response) {
        try {
            let email: string = req.params.email;

            let data = await studentService.getInfoStudentService(email);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }
}

export default new studentController();

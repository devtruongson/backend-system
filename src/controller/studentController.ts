import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { studentDto } from '~/dto/createStudent.dto';
import { loginDto } from '~/dto/login.dto';
import studentService from '~/service/studentService';
import { ResponseHandler } from '~/utils/Response';
import { validateData } from '~/utils/validate';

class studentController {
    //CREATE

    async handleCreateStudent(req: Request, res: Response) {
        try {
            await validateData(studentDto, req.body, res);
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

    // GET

    async handleGetStudent(req: Request, res: Response) {
        try {
            return res.status(httpStatus.OK).json();
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //DELETE

    async handleDeleteStudent(req: Request, res: Response) {
        try {
            return res.status(httpStatus.OK).json();
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
            return res.status(httpStatus.OK).json();
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }
}

export default new studentController();

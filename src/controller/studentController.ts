import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { studentDto } from '~/dto/createStudent.dto';
import { loginDto } from '~/dto/login.dto';
import Parent from '~/models/Parent';
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

    async CreateStudentBulk(req: Request, res: Response) {
        try {
            const data = await studentService.CreateStudentBulk(req.body);
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

    // Get All Students
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

    async handleGetAllStudent(req: Request, res: Response) {
        try {
            let data = await studentService.handleGetAllStudent(
                req.query.page as any,
                req.query.pageSize as any,
                req.query.course_code as any,
                req.query.filter as any,
                parseInt(req.query.level as string),
                req.query.textSearch as string,
                req.query.idSale as string,
            );
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    async handleGetOneStudent(req: Request, res: Response) {
        try {
            let data = await studentService.handleGetOneStudent(req.params.id as any);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    async handleGetCountStudent(req: Request, res: Response) {
        try {
            let data = await studentService.handleGetCountStudent(req.query.type as any, req.query.idStudent as any);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    async handleUpdateLevel(req: Request, res: Response) {
        try {
            let id: number = parseInt(req.query.id as string);
            let level: number = parseInt(req.query.level as string);
            let data = await studentService.updateLevelService(id, level);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    async handleSearch(req: Request, res: Response) {
        try {
            let textSearch: string = req.query.textSearch as string;
            let page: number = parseInt(req.query.page as string);
            let pageSize: number = parseInt(req.query.pageSize as string);
            let data = await studentService.searchStudentService(textSearch, page, pageSize);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    async handleInterView(req: Request, res: Response) {
        try {
            let data = await studentService.handleInterView(req.query.idStudent as string, res);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            return res.status(httpStatus.OK).json(err);
        }
    }

    async handleDelete(req: Request, res: Response) {
        try {
            const id: number = +req.params.id;
            let data = await studentService.deleteStudentService(id);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            return res.status(httpStatus.OK).json(err);
        }
    }
}

export default new studentController();

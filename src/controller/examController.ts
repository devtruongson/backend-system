import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { examDto } from '~/dto/createExam.dto';
import examService from '~/service/examService';
import { ResponseHandler } from '~/utils/Response';
import { validateData } from '~/utils/validate';
import { v4 as uuidv4 } from 'uuid';

class examController {
    //
    //CREATE

    async handleCreateExam(req: Request, res: Response) {
        try {
            const isValid = await validateData(examDto, req.body, res);
            if (!isValid) return;

            let dataBuider = {
                ...req.body,
                code: uuidv4().slice(0, 6).toUpperCase(),
            };

            let data = await examService.createExamService(dataBuider);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    // GET EXAM

    async handleGetExam(req: Request, res: Response) {
        try {
            let page = parseInt(req.query.page as string);
            let pageSize = parseInt(req.query.pageSize as string);
            let studentId = parseInt(req.query?.studentId as string);
            let teacherId = parseInt(req.query?.teacherId as string);
            let isComplated: boolean = req.query?.isComplated === 'true' ? true : false;

            let data = await examService.getExamService(
                studentId ? studentId : teacherId ? teacherId : 0,
                page,
                pageSize,
                studentId ? 'student' : teacherId ? 'teacher' : 'all',
                isComplated,
            );

            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    async handleGetExamDESC(req: Request, res: Response) {
        try {
            let studentId = parseInt(req.query?.studentId as string);

            let data = await examService.handleGetExamDESC(studentId);

            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //DELETE

    async handleDeleteExam(req: Request, res: Response) {
        try {
            let id = +req.params.id;
            let data = await examService.deleteExamService(id);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //UPDATE

    async handleUpdateInfoExam(req: Request, res: Response) {
        try {
            const isValid = await validateData(examDto, req.body, res);
            if (!isValid) return;
            let data = await examService.updateInfoExamService(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    // UPDATE SCORE EXAM

    async handleUpdateScoreExam(req: Request, res: Response) {
        try {
            // await validateData(examDto, req.body, res);

            let data = await examService.updateScoreExamService(req.body.listAnswer, +req.body.examId);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    async handleGetOneExam(req: Request, res: Response) {
        try {
            let isCompleted = req.query.isCompleted === 'true' ? true : false;
            let id: number = parseInt(req.query.id as string);
            let data = await examService.getOneExamService(id, isCompleted);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    async ChangeStatus(req: Request, res: Response) {
        try {
            if (!req.query.status || !req.query.id) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    code: 400,
                    data: null,
                    msg: 'missing status or id',
                });
            }
            const data = await examService.ChangeStatus(req.query.status as string, req.query.id as string);
            return res.status(httpStatus.OK).json(data);
        } catch (error) {
            console.log(error);
        }
    }
}

export default new examController();

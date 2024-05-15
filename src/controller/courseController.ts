import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { createCourseDto } from '~/dto/createCourse.dto';
import courserService from '~/service/courseService';
import { ResponseHandler } from '~/utils/Response';
import { validateData } from '~/utils/validate';
import { v4 as uuidv4 } from 'uuid';
import { queryGetData } from '~/dto/queryGetData.dto';
import courseService from '~/service/courseService';

class CourseController {
    //
    // GET

    async handleGetCourse(req: Request, res: Response) {
        try {
            let query: queryGetData = {
                page: parseInt(req.query.page as string),
                pageSize: parseInt(req.query.pageSize as string),
            };

            let data;
            if (!query.page || !query.pageSize) {
                data = await courseService.getAllCourseService();
            } else {
                data = await courserService.getCourseService(query);
            }

            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //CREATE

    async handleCreateCoure(req: Request, res: Response) {
        try {
            const isValid = await validateData(createCourseDto, req.body, res);
            if (!isValid) return;

            let dataBuider = {
                ...req.body,
                code: uuidv4().slice(0, 6).toUpperCase(),
            };

            const data = await courserService.createCourseService(dataBuider);

            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //DELETE

    async handleDeleteCourse(req: Request, res: Response) {
        try {
            let code: string = req.query.code as string;

            let data = await courserService.deleteCourseService(code);

            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    // UPDATE

    async handleUpdateCourse(req: Request, res: Response) {
        try {
            const isValid = await validateData(createCourseDto, req.body, res);
            if (!isValid) return;

            const data = await courseService.updateCourService(req.body);

            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }
}

const courseController = new CourseController();

export default courseController;

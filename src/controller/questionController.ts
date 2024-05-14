import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { questionDto } from '~/dto/createQuestion.dto';
import questionService from '~/service/questionService';
import { ResponseHandler } from '~/utils/Response';
import { validateData } from '~/utils/validate';

class questionController {
    // GET

    async handleGetQuestion(req: Request, res: Response) {
        try {
            let page = req.query?.page as number | undefined;
            let pageSize = req.query?.pageSize as number | undefined;
            let authorId = req.query?.authorId as number | undefined;

            let data;

            if (!page || !pageSize || !authorId) {
                data = await questionService.getAllQuestionService();
            } else {
                data = await questionService.getQuestionService(+page, +pageSize, +authorId);
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

    async handleCreateQuestion(req: Request, res: Response) {
        try {
            await validateData(questionDto, req.body, res);
            let data = await questionService.createQuestionService(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //DELETE

    async handleDeleteQuestion(req: Request, res: Response) {
        try {
            let id = +req.params.id;
            let data = await questionService.deleteQuestionService(id);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //UPDATE

    async handleUpdateQuestion(req: Request, res: Response) {
        try {
            await validateData(questionDto, req.body, res);
            let data = await questionService.updateQuestionService(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }
}

export default new questionController();
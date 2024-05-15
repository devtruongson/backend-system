import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { examQuestionDto } from '~/dto/createExamQuestion';
import examQuestionService from '~/service/examQuestionService';
import { ResponseHandler } from '~/utils/Response';
import { validateData } from '~/utils/validate';

class examQuestionController {
    //
    //CREATE

    async handleCreateExamQuestion(req: Request, res: Response) {
        try {
            let listData: examQuestionDto[] = req.body;
            let checkValid = true;
            await Promise.all(
                listData.map(async (item: examQuestionDto) => {
                    const isValid = await validateData(examQuestionDto, item, res);
                    if (!isValid) {
                        checkValid = false;
                    }
                }),
            );
            if (!checkValid) return;

            let data = await examQuestionService.createExamQuestionService(listData);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //DELETE

    async handleDeleteExamQuestion(req: Request, res: Response) {
        try {
            let id: number = +req.params.id;
            let data = await examQuestionService.deleteExamQuestionService(id);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //UPDATE

    async handleUpdateExamQuestion(req: Request, res: Response) {
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

export default new examQuestionController();

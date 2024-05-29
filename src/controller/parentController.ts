import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { parentDto } from '~/dto/createParent.dto';
import parentService from '~/service/parentService';
import { ResponseHandler } from '~/utils/Response';
import { validateData } from '~/utils/validate';

class parentController {
    //CREATE

    async handleCreateParent(req: Request, res: Response) {
        try {
            let isValid = await validateData(parentDto, req.body, res);
            if (!isValid) return;

            let data = await parentService.createParentService(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //DELETE

    async handleDeleteParent(req: Request, res: Response) {
        try {
            let id: number = +req.params.id;
            let data = await parentService.deleteParentService(id);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    async handleGetParent(req: Request, res: Response) {
        try {
            let id: number = +req.params.id;
            let data = await parentService.getParentService(id);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    async handleUpdateInfoParent(req: Request, res: Response) {
        try {
            const isValid = validateData(parentDto, req.body, res);
            if (!isValid) return;

            let data = await parentService.updateInfoParent(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (error) {
            console.log(error);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }
}

export default new parentController();

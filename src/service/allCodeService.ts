import httpStatus from 'http-status';
import { createAllCodeDTO } from '~/dto/creayeAllCode.dto';
import AllCode from '~/models/AllCode';
import { ResponseHandler } from '~/utils/Response';

class allCodeService {
    async createAllCode(body: createAllCodeDTO) {
        try {
            await AllCode.create({
                ...body,
            });
            return ResponseHandler(httpStatus.OK, null, 'allcode create successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async getAllCodeByType(type: string) {
        try {
            const query: any = {};

            if (type.toLocaleLowerCase() !== 'all') {
                query.where = {
                    type,
                };
            }
            let data = await AllCode.findAll({
                ...query,
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            });
            return ResponseHandler(httpStatus.OK, data, 'ok');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new allCodeService();

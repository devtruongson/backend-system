import httpStatus from 'http-status';
import { parentDto } from '~/dto/createParent.dto';
import Parent from '~/models/Parent';
import { ResponseHandler } from '~/utils/Response';

class parentService {
    // CREATE

    async createParentService(data: parentDto) {
        try {
            await Parent.create({
                ...data,
            });
            return ResponseHandler(httpStatus.OK, null, 'Create Parent successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //DELETE

    async deleteParentService(id: number) {
        try {
            await Parent.destroy({
                where: { id: id },
            });
            return ResponseHandler(httpStatus.OK, null, 'Delete Parent successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new parentService();

import httpStatus from 'http-status';
import { parentDto } from '~/dto/createParent.dto';
import AllCode from '~/models/AllCode';
import Parent from '~/models/Parent';
import { ResponseHandler } from '~/utils/Response';

class parentService {
    // CREATE

    async createParentService(data: parentDto) {
        try {
            console.log(data);
            await Parent.create({
                ...data,
            });
            return ResponseHandler(httpStatus.OK, null, 'Thêm thông tin phụ huynh thành công');
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
            return ResponseHandler(httpStatus.OK, null, 'Xóa thông tin phụ huynh thành công ');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //  GET

    async getParentService(id: number) {
        try {
            if (!id) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Có lỗi xảy ra !');
            }

            let data = await Parent.findAll({
                where: { child: id },
                include: [
                    {
                        model: AllCode,
                        as: 'AssociationData',
                    },
                ],
            });

            return ResponseHandler(httpStatus.OK, data, ' Parents');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //  UPDATE

    async updateInfoParent(data: parentDto) {
        try {
            await Parent.update(
                {
                    ...data,
                },
                {
                    where: {
                        id: data.id,
                    },
                },
            );
            return ResponseHandler(httpStatus.OK, data, ' Cập nhật thông tin phụ hunh thành công');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new parentService();

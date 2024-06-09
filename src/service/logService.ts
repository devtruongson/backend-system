import httpStatus from 'http-status';
import Log from '~/models/Log';
import { ResponseHandler } from '~/utils/Response';

class logService {
    async getAllLog(idStudent: string) {
        if (!idStudent) {
            return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Thiếu ID Student');
        }

        const data = await Log.findAll({
            where: {
                student_id: idStudent,
            },
        });

        return ResponseHandler(httpStatus.OK, data, 'ok');
    }
}

export default new logService();

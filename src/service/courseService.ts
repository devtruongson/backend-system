import httpStatus from 'http-status';
import { createCourseDto } from '~/dto/createCourse.dto';
import { queryGetData } from '~/dto/queryGetData.dto';
import { handleRemoveFile } from '~/helpers/handleRemoveImg';
import AllCode from '~/models/AllCode';
import Course from '~/models/Course';
import { ResponseHandler } from '~/utils/Response';

class CourserService {
    async handleCheckCodeExit(
        code: string,
        type: 'check' | 'query' = 'check',
    ): Promise<boolean | createCourseDto | null> {
        let isCheck = false;

        let course = (await Course.findOne({
            where: { code: code },
        })) as createCourseDto | null;
        if (course) {
            isCheck = true;
        }

        return type === 'check' ? isCheck : course;
    }

    // CREATE

    async createCourseService(data: createCourseDto) {
        try {
            let isCodeExit = await this.handleCheckCodeExit(data.code);

            if (isCodeExit) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'code course already exists');
            }

            await Course.create({
                ...data,
            });

            return ResponseHandler(httpStatus.OK, null, ' Create Course Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //  DELETE

    async deleteCourseService(code: string) {
        try {
            let course = (await this.handleCheckCodeExit(code, 'query')) as createCourseDto;

            if (!course) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, "course is don't exists");
            }

            if (!handleRemoveFile(course.thumbnail, 'courseImage')) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, "can't remove thumbnail");
            }

            await Course.destroy({
                where: { code: code },
            });

            return ResponseHandler(httpStatus.OK, null, 'Delete Course Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // GET ALL

    async getAllCourseService() {
        try {
            let courses = await Course.findAll();

            return ResponseHandler(httpStatus.OK, courses, 'all course');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // GET LIMIT

    async getCourseService(data: queryGetData) {
        try {
            let offset: number = (data.page - 1) * data.pageSize;
            let { count, rows } = await Course.findAndCountAll({
                include: [{ model: AllCode, as: 'TrainingSectorData' }],
                offset: offset,
                limit: data.pageSize,
            });

            let resData = {
                items: rows,
                meta: {
                    currentPage: data.page,
                    totalIteams: count,
                    totalPages: Math.ceil(count / data.pageSize),
                },
            };

            return ResponseHandler(httpStatus.OK, resData, 'list course');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // UPDATE

    async updateCourService(data: createCourseDto) {
        try {
            if (data.isChangeFile && data.fileOld && !handleRemoveFile(data.fileOld, 'courseImage')) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, "can't remove thumbnail");
            }

            await Course.update(
                {
                    ...data,
                },
                {
                    where: { id: data.id },
                },
            );

            return ResponseHandler(httpStatus.OK, null, 'update course successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new CourserService();

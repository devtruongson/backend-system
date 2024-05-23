import express, { Express } from 'express';
import courseController from '~/controller/courseController';
import { handleCheckTokenAdmin, handleCheckTokenUser } from '~/middleware/jwtActions';
import { uploadThumbnailCourse } from '~/middleware/multer';

const router = express.Router();

const initApiCourse = (app: Express) => {
    router.post(
        '/create',
        // handleCheckTokenAdmin,
        // uploadThumbnailCourse.single('thumbnail'),
        courseController.handleCreateCoure,
    );

    router.delete(
        '/delete',
        // handleCheckTokenAdmin,
        courseController.handleDeleteCourse,
    );

    router.get(
        '/get',
        // handleCheckTokenUser,
        courseController.handleGetCourse,
    );

    router.get(
        '/student',
        // handleCheckTokenUser,
        courseController.handleGetCourseByTrainingId,
    );

    router.get('/student-course', handleCheckTokenUser, courseController.handleGetCourseByStudent);

    router.put('/update', handleCheckTokenAdmin, courseController.handleUpdateCourse);

    return app.use('/v1/course', router);
};

export default initApiCourse;

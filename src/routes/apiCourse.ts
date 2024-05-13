import express, { Express } from 'express';
import courseController from '~/controller/courseController';
import { handleCheckTokenAdmin } from '~/middleware/jwtActions';
import { uploadThumbnailCourse } from '~/middleware/multer';

const router = express.Router();

const initApiCourse = (app: Express) => {
    router.post(
        '/create',
        // handleCheckTokenAdmin,
        uploadThumbnailCourse.single('thumbnail'),
        courseController.handleCreateCoure,
    );

    router.delete(
        '/delete',
        // handleCheckTokenAdmin,
        courseController.handleDeleteCourse,
    );

    router.get(
        '/get',
        // handleCheckTokenAdmin ,
        courseController.handleGetCourse,
    );

    router.put('/update', handleCheckTokenAdmin, courseController.handleUpdateCourse);

    return app.use('/v1/course', router);
};

export default initApiCourse;

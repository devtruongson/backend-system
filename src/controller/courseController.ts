import {Request, Response} from "express"
import httpStatus from "http-status";
import { createCourseDto } from "~/dto/createCourse.dto";
import courserService from "~/service/courseService"
import { ResponseHandler } from "~/utils/Response";
import { validateData } from "~/utils/validate";
import { v4 as uuidv4 } from 'uuid';


class CourseController {

    async handleGetCourse (req: Request , res : Response ){
        try{
            
        }catch(err){
         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR,null , "error from server"));
     }    
    }

    async handleCreateCoure (req:Request , res:Response){
        try{
            await validateData(createCourseDto , req.body , res);
            let dataBuider = {
                ...req.body['0'],
                code : uuidv4().slice(0,6).toUpperCase()
            }

            const data = await courserService.createCourseService(dataBuider);

            return res.status(httpStatus.OK).json(data); 

        }catch(err){
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR,null , "error from server"));
        }
    }


    async handleDeleteCourse( req : Request ,res : Response){
        try{
            let id : number = req.body.id as number;

            let data = await courserService.deleteCourseService(id);

            return res.status(httpStatus.OK).json(data); 

        }catch(err){
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR,null , "error from server"));
        }
    }

    
}

const courseController = new CourseController();

export default courseController;
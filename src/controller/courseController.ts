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

            if(!req.file){
                return res.status(httpStatus.NOT_FOUND).json(ResponseHandler(httpStatus.NOT_FOUND , null , "can't upload thumbnail"))
            }
            
            let dataBuider = {
                ...req.body['0'],
                thumbnail:req.file?.fieldname,
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
            let code : string = req.query.code as string;

            let data = await courserService.deleteCourseService(code);

            return res.status(httpStatus.OK).json(data); 

        }catch(err){
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR,null , "error from server"));
        }
    }


    async handleUpdateCourse(req:Request , res: Response ){
        try{

        }catch(err){
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR,null , "error from server"));
        }
    }

    
}

const courseController = new CourseController();

export default courseController;
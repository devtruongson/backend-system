import {Request, Response} from "express"
import httpStatus from "http-status";
import courserService from "~/service/courseService"
import { ResponseHandler } from "~/utils/Response";


class CourseController {

    async handleCreateCoure (req:Request , res:Response){
        try{
            
        }catch(err){
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR,null , "error from server"));
        }
    }

    async handleGetCourse (req: Request , res : Response ){
       try{
           
       }catch(err){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR,null , "error from server"));
    }    
   }
}

const courseController = new CourseController();

export default courseController;
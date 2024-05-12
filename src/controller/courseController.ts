import {Request, Response} from "express"
import courserService from "~/service/courseService"


class CourseController {
    async handleGetCourse (req: Request , res : Response ){
       try{
           
       }catch(err){
           console.log(err);
       }    
   }
}

const courseController = new CourseController();

export default courseController;
import httpStatus from "http-status";
import { title } from "process";
import { createCourseDto } from "~/dto/createCourse.dto";
import Course from "~/models/Course";
import { ResponseHandler } from "~/utils/Response";


class CourserService {

    async handleCheckCodeExit (code : string) : Promise<boolean> {
        let course = await Course.findOne({
            where:{code : code}
        })
        if(course) return true;

        return false;
    }


    async createCourseService(data : createCourseDto){
        try{
            console.log(typeof data)
            let isCodeExit = await this.handleCheckCodeExit(data.code);

            if(isCodeExit){
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'code course already exists');
            }

            await Course.create({
                title:data.title,
                code : data.code,
                is_free: data.is_free,
                is_try_learning: data.is_try_learning,
                price:data.price,
                thumbnail:data.thumbnail,
                training_sector:data.training_sector,
                discount:data.discount
            })

            return ResponseHandler(httpStatus.OK , null , ' Create Course Successfully')
        }catch(err){
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async deleteCourseService(id : number){
        try{
            await Course.destroy({
                where:{id: id}
            })

            return ResponseHandler(httpStatus.OK , null , 'Delete Course Successfully') 
        }catch(err){
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }

    }

    // async updateCourService
}

export default new CourserService();
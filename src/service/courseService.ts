import httpStatus from "http-status";
import { createCourseDto } from "~/dto/createCourse.dto";
import { handleRemoveThumbnailCourse } from "~/helpers/handleRemoveImg";
import Course from "~/models/Course";
import { ResponseHandler } from "~/utils/Response";


class CourserService {

    async handleCheckCodeExit (code : string , type: 'check' | 'query' = 'check') : Promise< boolean | createCourseDto | null  > {
        let isCheck = false;

        let course = await Course.findOne({
            where:{code : code}
        }) as createCourseDto  | null;
        if(course) {
            isCheck = true;
        }

        return type === 'check' ? isCheck : course;
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

    async deleteCourseService(code : string){
        try{
            
            let course = await this.handleCheckCodeExit(code , "query") as createCourseDto;

            if(!course) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, "course is don't exists");
            }

            if(!handleRemoveThumbnailCourse(course.thumbnail)){
                return ResponseHandler(httpStatus.BAD_REQUEST, null, "can't remove thumbnail");
            }

            await Course.destroy({
                where:{code: code}
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
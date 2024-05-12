import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class createCourseDto {

    @IsString()
    @IsNotEmpty()
    title :string;

    @IsString()
    code:string;

    @IsBoolean()
    @IsNotEmpty()
    is_free: boolean;

    @IsBoolean()
    @IsNotEmpty()
    is_try_learning: boolean;

    @IsString()
    @IsNotEmpty()
    price:string;
    
    @IsString()
    @IsNotEmpty()
    thumbnail:string;

    @IsNumber()
    @IsNotEmpty()
    training_sector: number;

    @IsNumber()
    @IsNotEmpty()
    discount : string
}
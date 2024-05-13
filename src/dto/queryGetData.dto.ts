import { IsNotEmpty, IsNumber } from "class-validator";

export class queryGetData {

    @IsNumber()
    @IsNotEmpty()
    page: number;


    @IsNumber()
    @IsNotEmpty()
    pageSize: number;
}
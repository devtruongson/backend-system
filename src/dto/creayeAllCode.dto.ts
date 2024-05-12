import { IsNotEmpty, IsString } from 'class-validator';

export class createAllCodeDTO {
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}

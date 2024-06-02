import { IsNotEmpty, IsNumberString, IsString, MinLength } from 'class-validator';

export class studentDto {
    id: number;

    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    @IsNumberString()
    @MinLength(10)
    phoneNumber: string;

    @IsNotEmpty()
    email: string;

    // @IsNotEmpty()
    gender: boolean;

    // @IsNotEmpty()
    birthday: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    avatar: string;

    // @IsNotEmpty()
    level: number;

    @IsNotEmpty()
    province: string;

    @IsNotEmpty()
    district: string;

    @IsNotEmpty()
    commune: string;

    address_detail: string;

    @IsNotEmpty()
    course_code: string;
}

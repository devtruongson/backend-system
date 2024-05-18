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
    address: number;

    address_detail: string;
}

import { IsNotEmpty, IsEmail, IsString, IsNumberString, IsNumber, MinLength } from 'class-validator';

export class CreateUserDto {
    constructor() {}

    @IsNotEmpty()
    @IsNumber()
    role: number;

    @IsNotEmpty()
    @IsNumber()
    address: string;

    @IsNotEmpty()
    @IsString()
    address_detail: string;

    @IsNotEmpty()
    @IsNumberString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}

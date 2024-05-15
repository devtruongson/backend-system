import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class studentDto {
    id: number;

    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    gender: boolean;

    @IsNotEmpty()
    birthday: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    avatar: string;

    @IsNotEmpty()
    level: number;

    address: number;

    address_detail: string;
}

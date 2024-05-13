import { IsNotEmpty, IsString } from 'class-validator';

export class createCalendarDto {
    @IsNotEmpty()
    @IsString()
    time_start: string;

    @IsNotEmpty()
    @IsString()
    time_end: string;
}

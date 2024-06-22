import { IsNotEmpty, IsString } from 'class-validator';

export class createCalendarDto {
    id: number;

    @IsNotEmpty()
    @IsString()
    time_start: string;

    @IsNotEmpty()
    @IsString()
    time_end: string;
}

import { IsNotEmpty } from 'class-validator';

export class bookingCalendarDto {
    @IsNotEmpty()
    teacher_id: number;

    @IsNotEmpty()
    calendar_id: number;

    @IsNotEmpty()
    day: string;

    @IsNotEmpty()
    time_stamp_start: string;

    @IsNotEmpty()
    time_stamp_end: string;
}

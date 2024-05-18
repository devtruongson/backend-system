import { IsNotEmpty, IsNumber } from 'class-validator';

export class studentBookingDto {
    id: number;

    @IsNotEmpty()
    @IsNumber()
    student_id: number;

    @IsNotEmpty()
    @IsNumber()
    course_id: number;
}

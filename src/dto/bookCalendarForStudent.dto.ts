import { IsNotEmpty, IsNumber } from 'class-validator';

export class bookCalendarForStudentDto {
    @IsNotEmpty()
    @IsNumber()
    student_id: number;

    @IsNotEmpty()
    @IsNumber()
    calendar_id: number;

    @IsNotEmpty()
    @IsNumber()
    teacher_id: number;

    @IsNotEmpty()
    @IsNumber()
    id_student_course: number;
}

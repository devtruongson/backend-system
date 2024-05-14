import { IsNotEmpty } from 'class-validator';

export class examDto {
    id: number;

    code: string;

    @IsNotEmpty()
    student_id: number;

    @IsNotEmpty()
    teacher_id: number;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    time_end: number;

    correct_result_count: number;

    @IsNotEmpty()
    total_question: number;

    total_result: number;

    @IsNotEmpty()
    level: number;

    createdAt: string;

    updatedAt: string;
}

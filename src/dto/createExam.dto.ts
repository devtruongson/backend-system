import { IsNotEmpty } from 'class-validator';
import { examQuestionDto } from './createExamQuestion';

export class examDto {
    id: number;

    code: string;

    @IsNotEmpty()
    student_id: number;

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

    @IsNotEmpty()
    class: number;

    @IsNotEmpty()
    course_code: string;

    is_completed: boolean;

    createdAt: string;

    updatedAt: string;

    ExamQuestionData: examQuestionDto[];
}

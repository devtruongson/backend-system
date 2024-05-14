import { IsNotEmpty } from 'class-validator';

export class examQuestionDto {
    id: number;

    @IsNotEmpty()
    exam_id: number;

    @IsNotEmpty()
    question_id: number;

    @IsNotEmpty()
    is_right: boolean;

    createdAt: string;

    updatedAt: string;
}

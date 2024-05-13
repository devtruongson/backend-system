import { IsNotEmpty } from 'class-validator';

export class answerDto {
    id: number;

    @IsNotEmpty()
    answer_title: number;

    @IsNotEmpty()
    is_right: boolean;

    @IsNotEmpty()
    question_id: number;

    createdAt: string;

    updatedAt: string;
}

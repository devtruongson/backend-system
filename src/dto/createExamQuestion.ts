import { IsNotEmpty } from 'class-validator';
import { questionDto } from './createQuestion.dto';

export class examQuestionDto {
    id: number;

    @IsNotEmpty()
    exam_id: number;

    @IsNotEmpty()
    question_id: number;

    @IsNotEmpty()
    is_right: number;

    createdAt: string;

    updatedAt: string;

    QuestionData: questionDto;
}

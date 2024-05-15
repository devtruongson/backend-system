import { IsNotEmpty } from 'class-validator';
import { answerDto } from './createAnswer.dto';

export class questionDto {
    id: number;

    title: string;

    file: string;

    @IsNotEmpty()
    suggest: string;

    @IsNotEmpty()
    level: number;

    @IsNotEmpty()
    author_id: number;

    createdAt: string;

    updatedAt: string;

    isChangeFile: boolean;

    fileOld: string;

    answers: answerDto[];
}

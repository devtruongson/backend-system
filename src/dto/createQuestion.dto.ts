import { IsNotEmpty } from 'class-validator';

export class questionDto {
    id: number;

    @IsNotEmpty()
    title: string;

    file: string;

    suggest: string;

    @IsNotEmpty()
    level: number;

    @IsNotEmpty()
    author_id: number;

    createdAt: string;

    updatedAt: string;
}

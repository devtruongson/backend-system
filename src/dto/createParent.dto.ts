import { IsNotEmpty } from 'class-validator';

export class parentDto {
    id: number;

    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    association_for_student: number;

    @IsNotEmpty()
    child: number;
}

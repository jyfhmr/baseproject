import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTaxDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    typeTax: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}

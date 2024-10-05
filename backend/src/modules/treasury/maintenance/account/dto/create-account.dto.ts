import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    nameAccount: string;
    @IsString()
    @IsNotEmpty()
    typeAccount: string;
    @IsString()
    @IsNotEmpty()
    description: string;

    commissions: any
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateReasonDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    module: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    transactionType: string;
}

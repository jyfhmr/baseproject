import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber} from "class-validator";

export class CreateTaxUnitsRateDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    readonly value: number;

}

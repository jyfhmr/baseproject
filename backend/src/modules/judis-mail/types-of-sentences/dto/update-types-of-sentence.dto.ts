import { PartialType } from '@nestjs/swagger';
import { CreateTypesOfSentenceDto } from './create-types-of-sentence.dto';

export class UpdateTypesOfSentenceDto extends PartialType(CreateTypesOfSentenceDto) {}

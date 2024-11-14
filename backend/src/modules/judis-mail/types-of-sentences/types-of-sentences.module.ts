import { Module } from '@nestjs/common';
import { TypesOfSentencesService } from './types-of-sentences.service';
import { TypesOfSentencesController } from './types-of-sentences.controller';
import { TypesOfSentence } from './entities/types-of-sentence.entity';

@Module({
  controllers: [TypesOfSentencesController],
  providers: [TypesOfSentencesService],
})
export class TypesOfSentencesModule {}

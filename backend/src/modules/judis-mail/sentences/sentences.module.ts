import { Module } from '@nestjs/common';
import { SentencesService } from './sentences.service';
import { SentencesController } from './sentences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sentence } from './entities/sentence.entity';
import { TypesOfSentence } from '../types-of-sentences/entities/types-of-sentence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sentence]), TypeOrmModule.forFeature([TypesOfSentence])],
  controllers: [SentencesController],
  providers: [SentencesService],
})
export class SentencesModule {}

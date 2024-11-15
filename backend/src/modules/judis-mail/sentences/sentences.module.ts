import { Module } from '@nestjs/common';
import { SentencesService } from './sentences.service';
import { SentencesController } from './sentences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sentence } from './entities/sentence.entity';
import { TypesOfSentence } from '../types-of-sentences/entities/types-of-sentence.entity';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sentence]), TypeOrmModule.forFeature([TypesOfSentence]), MailsModule],
  controllers: [SentencesController],
  providers: [SentencesService],
  exports: [SentencesService]
})
export class SentencesModule {}

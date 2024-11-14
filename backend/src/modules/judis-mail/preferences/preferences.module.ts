import { Module } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { PreferencesController } from './preferences.controller';
import { TypesOfSentence } from '../types-of-sentences/entities/types-of-sentence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/config/users/entities/user.entity';
import { preferences_per_user } from './entities/preference.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([TypesOfSentence]) , TypeOrmModule.forFeature([User]),    TypeOrmModule.forFeature([preferences_per_user])],
  controllers: [PreferencesController],
  providers: [PreferencesService],
})
export class PreferencesModule {}

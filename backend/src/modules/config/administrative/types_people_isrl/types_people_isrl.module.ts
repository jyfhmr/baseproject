import { Module } from '@nestjs/common';
import { TypesPeopleIsrlService } from './types_people_isrl.service';
import { TypesPeopleIsrlController } from './types_people_isrl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../users/users.module';
import { TypesPeopleIsrl } from './entities/types_people_isrl.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TypesPeopleIsrl]) ],
    controllers: [TypesPeopleIsrlController],
    providers: [TypesPeopleIsrlService],
    exports: [TypeOrmModule],
})
export class TypesPeopleIsrlModule {}

import { Module } from '@nestjs/common';
import { Rates2RangesService } from './rates2_ranges.service';
import { Rates2RangesController } from './rates2_ranges.controller';
import { Rates2Range } from './entities/rates2_range.entity';
import { UsersModule } from '../../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Rates2Range]),UsersModule],
  controllers: [Rates2RangesController],
  providers: [Rates2RangesService],
})
export class Rates2RangesModule {}

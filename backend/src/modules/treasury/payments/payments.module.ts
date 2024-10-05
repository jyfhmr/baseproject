import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treasury_Payments } from './entities/payment.entity';
import { Treasury_maintenance_Money } from '../maintenance/money/entities/money.entity';
import { UsersModule } from 'src/modules/config/users/users.module';
import { CorrelativeModule } from 'src/modules/config/correlative/correlative.module';

@Module({
  imports: [TypeOrmModule.forFeature([Treasury_Payments]),TypeOrmModule.forFeature([Treasury_maintenance_Money]), UsersModule, CorrelativeModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

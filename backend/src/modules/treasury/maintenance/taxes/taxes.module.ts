import { forwardRef, Module } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { TaxesController } from './taxes.controller';
import { UsersModule } from '../../../config/users/users.module';
import { MoneyModule } from '../../../treasury/maintenance/money/money.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treasury_maintenance_Tax } from './entities/tax.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Treasury_maintenance_Tax]),
        UsersModule,
        forwardRef(() => MoneyModule),
    ],
    controllers: [TaxesController],
    providers: [TaxesService],
    exports: [TaxesService, TypeOrmModule],
})
export class TaxesModule {}

import { Module } from '@nestjs/common';
import { RatesOrPorcentageService } from './rates_or_porcentage.service';
import { RatesOrPorcentageController } from './rates_or_porcentage.controller';
import { UsersModule } from 'src/modules/config/users/users.module';
import { RatesOrPorcentage } from 'src/modules/config/administrative/rates_or_porcentage/entities/rates_or_porcentage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([RatesOrPorcentage]) ],
    controllers: [RatesOrPorcentageController],
    providers: [RatesOrPorcentageService],
    exports: [TypeOrmModule],
})
export class RatesOrPorcentageModule {}

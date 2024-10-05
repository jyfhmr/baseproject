import { forwardRef, Module } from '@nestjs/common';
import { CreditNoteService } from './credit_note.service';
import { CreditNoteController } from './credit_note.controller';
import { UsersModule } from 'src/modules/config/users/users.module';
import { cyp_accounts_payable_documents_credit_note } from './entities/credit_note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyModule } from 'src/modules/treasury/maintenance/money/money.module';
import { ProvidersModule } from 'src/modules/masters/providers/providers.module';
import { ReasonModule } from 'src/modules/config/administrative/reason/reason.module';
import { config_admistrative_reason } from 'src/modules/config/administrative/reason/entities/reason.entity';
import { ModuleModule } from 'src/modules/config/module/module.module';
import { CorrelativeModule } from 'src/modules/config/correlative/correlative.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            cyp_accounts_payable_documents_credit_note,
            config_admistrative_reason,
        ]),
        UsersModule,
        CorrelativeModule,
        forwardRef(() => MoneyModule),
        forwardRef(() => ProvidersModule),
        forwardRef(() => ReasonModule),
        forwardRef(() => ModuleModule),
    ],
    controllers: [CreditNoteController],
    providers: [CreditNoteService],
    exports: [CreditNoteService],
})
export class CreditNoteModule {}

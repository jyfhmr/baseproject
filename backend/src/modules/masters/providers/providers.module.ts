import { forwardRef, Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { Provider } from './entities/provider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/config/users/users.module';
import { config_admistrative_paymentConcept } from 'src/modules/config/administrative/payment_concepts/entities/payment_concept.entity';
import { CreditNoteModule } from 'src/modules/accounts_payable/documents/credit_note/credit_note.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Provider, config_admistrative_paymentConcept]),
        UsersModule,
        forwardRef(() => CreditNoteModule),
    ],
    controllers: [ProvidersController],
    providers: [ProvidersService],
})
export class ProvidersModule {}
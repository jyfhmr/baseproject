import { IsOptional } from 'class-validator';
import { config_admistrative_reason } from 'src/modules/config/administrative/reason/entities/reason.entity';
import { Config_Module } from 'src/modules/config/module/entities/module.entity';
import { User } from 'src/modules/config/users/entities/user.entity';
import { Provider } from 'src/modules/masters/providers/entities/provider.entity';
import { Treasury_maintenance_Money } from 'src/modules/treasury/maintenance/money/entities/money.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm';

@Entity()
export class cyp_accounts_payable_documents_credit_note {
    @PrimaryGeneratedColumn()
    id: number;

    // Relacionar la moneda a una entidad de Currency
    @ManyToOne(() => Provider, { nullable: true })
    @IsOptional()
    company?: Provider; // Moneda aplicable al impuesto
    // provedor

    @Column()
    address: string;

    @Column()
    ssn: string;
    @Column()
    correlative: string;

    @Column()
    phone: number;

    @Column()
    typePayment: number;

    // Relacionar la moneda a una entidad de Currency
    @ManyToOne(() => Treasury_maintenance_Money, { nullable: true })
    @IsOptional()
    typeMoney?: Treasury_maintenance_Money; // Moneda aplicable al impuesto

    // Relacionar la moneda a una entidad de Currency
    @ManyToOne(() => Config_Module, { nullable: true })
    @IsOptional()
    module?: Config_Module; // Moneda aplicable al impuesto

    // Relacionar la moneda a una entidad de Currency
    @ManyToMany(() => config_admistrative_reason, { nullable: true })
    @JoinTable() // Necesario para relaciones Many-to-Many
    motive: config_admistrative_reason[]; // Nota: motives es ahora un array

    // datos de nota de debito

    @Column({ nullable: true }) // Define el campo como JSON
    motiveBalances: string; // Define el tipo como un objeto de claves y valores numéricos

    @Column()
    applyBook: number;

    // @Column()
    // module: number;

    @Column()
    numberCreditNote: string;

    @Column()
    controlNumber: string;

    @Column({ type: 'timestamp' })
    createAtDebit: Date;

    @Column({ type: 'datetime', nullable: true, default: null })
    dueDate: Date;

    // tabla

    @Column()
    observation: string;

    @Column('decimal', { precision: 16, scale: 4 })
    discount: number;

    @Column('decimal', { precision: 16, scale: 4 })
    subtotal: number;
    @Column('decimal', { precision: 16, scale: 4 })
    vat: number;
    @Column('decimal', { precision: 16, scale: 4 })
    total: number;
    @Column('decimal', { precision: 16, scale: 4 })
    balance: number;
    @Column('decimal', { precision: 16, scale: 4 })
    exempt: number;

    @Column('decimal', { precision: 16, scale: 4 })
    igtf: number;

    @Column('decimal', { precision: 16, scale: 4 })
    rage: number;
    // @Column()
    // exonerated: number;

    // otros

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @Column({ default: false }) // Valor por defecto para isActive
    statusDebit: boolean;

    @ManyToOne(() => User, (user) => user.moneysUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.moneys)
    user: User;
}

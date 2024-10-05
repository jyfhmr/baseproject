import { User } from 'src/modules/config/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Treasury_maintenance_Tax } from '../../taxes/entities/tax.entity';
import { cyp_accounts_payable_documents_credit_note } from 'src/modules/accounts_payable/documents/credit_note/entities/credit_note.entity';

@Entity()
export class Treasury_maintenance_Money {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    money: string;

    @Column()
    symbol: string;

    @Column({ nullable: true })
    file?: string; //puede ser nulo

    @OneToMany(() => Treasury_maintenance_Tax, (tax) => tax.applicableCurrency)
    taxes: Treasury_maintenance_Tax[];

    @OneToMany(
        () => cyp_accounts_payable_documents_credit_note,
        (creditNote) => creditNote.typeMoney,
    )
    creditNote: cyp_accounts_payable_documents_credit_note[];

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.moneysUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.moneys)
    user: User;
}

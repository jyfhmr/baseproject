import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from 'src/modules/config/users/entities/user.entity';
import { cyp_accounts_payable_documents_credit_note } from 'src/modules/accounts_payable/documents/credit_note/entities/credit_note.entity';

@Entity()
export class config_admistrative_reason {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    module: string;

    @Column()
    description?: string;

    @Column()
    transactionType?: string;

    @OneToMany(() => cyp_accounts_payable_documents_credit_note, (note) => note.motive)
    motive: cyp_accounts_payable_documents_credit_note[];

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.PaymentMethodUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.paymentMethod)
    user: User;
}

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
export class Config_Module {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description?: string;

    @Column()
    color?: string;

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.configModuleUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.configModule)
    user: User;

    // relaciones

    @OneToMany(() => cyp_accounts_payable_documents_credit_note, (creditNote) => creditNote.module)
    creditNote: cyp_accounts_payable_documents_credit_note;
}

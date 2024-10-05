import { IsString } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Treasury_maintenance_Bank } from '../../banks/entities/bank.entity';
import { User } from 'src/modules/config/users/entities/user.entity';
import { ComissionPerPaymentMethod } from 'src/modules/treasury/comission_per_payment_method/entities/comission_per_payment_method.entity';

@Entity()
export class Treasury_maintenance_Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    nameAccount: string;

    @Column()
    @IsString()
    typeAccount: string;

    @Column()
    @IsString()
    description: string;

    // Relación Many-to-One: Muchas cuentas pueden pertenecer a un banco
    @ManyToOne(() => Treasury_maintenance_Bank, (bank) => bank.accounts)
    bank: Treasury_maintenance_Bank;

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.accountUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.account)
    user: User;


    @OneToMany(() => ComissionPerPaymentMethod, (commission) => commission.account, { cascade: true })
    commissions: ComissionPerPaymentMethod[];

}

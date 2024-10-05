import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { User } from 'src/modules/config/users/entities/user.entity';

@Entity()
export class Treasury_maintenance_PaymentMethod {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    method: string;
    @Column()
    typeMethodPayment: string;
    @Column()
    description?: string;
    @Column()
    code: number;

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

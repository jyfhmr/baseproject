import { Treasury_maintenance_PaymentMethod } from 'src/modules/treasury/maintenance/payment_method/entities/payment_method.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
export class PaymentMethodSeeder1721921619969 implements Seeder {
    track = false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const repository = dataSource.getRepository(Treasury_maintenance_PaymentMethod);

        const paymentMethods = [
            {
                method: 'Tarjeta de crédito',
                typeMethodPayment: 'Crédito',
                description: 'Pago con tarjeta de crédito',
                code: 1,
                isActive: true,
            },
            {
                method: 'Tarjeta de débito',
                typeMethodPayment: 'Débito',
                description: 'Pago con tarjeta de débito',
                code: 2,
                isActive: true,
            },
            {
                method: 'Transferencia bancaria',
                typeMethodPayment: 'Transferencia',
                description: 'Pago mediante transferencia bancaria',
                code: 3,
                isActive: true,
            },
            {
                method: 'Pago móvil',
                typeMethodPayment: 'Móvil',
                description: 'Pago mediante aplicación de pago móvil',
                code: 4,
                isActive: true,
            },
            {
                method: 'PayPal',
                typeMethodPayment: 'Digital',
                description: 'Pago mediante PayPal',
                code: 5,
                isActive: true,
            },
            {
                method: 'Efectivo',
                typeMethodPayment: 'Efectivo',
                description: 'Pago en efectivo',
                code: 6,
                isActive: true,
            },
            {
                method: 'Bitcoin',
                typeMethodPayment: 'Criptomoneda',
                description: 'Pago mediante Bitcoin',
                code: 7,
                isActive: true,
            },
            {
                method: 'Zelle',
                typeMethodPayment: 'Digital',
                description: 'Pago mediante Zelle',
                code: 8,
                isActive: true,
            },
            {
                method: 'Depósito',
                typeMethodPayment: 'Depósito',
                description: 'Depósito Bancario',
                code: 9,
                isActive: true,
            },
        ];
        await repository.save(paymentMethods);
    }
}

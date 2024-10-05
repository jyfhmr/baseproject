import { DiscountType } from 'src/modules/config/administrative/discount_types/entities/discount_type.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class DiscountTypesSeeder1727966448574 implements Seeder {
    track = false;

    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const repository = dataSource.getRepository(DiscountType);

        const discount_type = [
            {
                name: 'Sín descuento',
            },
            {
                name: 'Descuento por artículo',
            },
            {
                name: 'Descuento a total',
            },
        ];
        await repository.save(discount_type);
    }
}


import { Treasury_maintenance_Money } from 'src/modules/treasury/maintenance/money/entities/money.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class MoneySeeder implements Seeder {
    track = false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const repository = dataSource.getRepository(Treasury_maintenance_Money);

        const currency = [
            { money: 'Dólar', symbol: 'USD',file: "usd.svg" ,isActive: true },
            { money: 'Bolívar', symbol: 'BSF', isActive: true },
            { money: 'Euro', symbol: 'EUR', file: "eur.png" ,isActive: true },
        ];

        await repository.save(currency);
    }
}

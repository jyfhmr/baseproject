import { TypesOfSentence } from 'src/modules/judis-mail/types-of-sentences/entities/types-of-sentence.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class TypeofsentenceSeeder1731607015611 implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {

        const repository = dataSource.getRepository(TypesOfSentence);

        const typesOfSentences = [
            {
                id: 1,
                type: 'Plena'
            },
            {
                id: 2,
                type: 'Constitucional'
            },
            {
                id: 3,
                type: 'PoliticoAdministrativa'
            },
            {
                id: 4,
                type: 'Electoral'
            },
            {
                id: 5,
                type: 'Civil'
            },
            {
                id: 6,
                type: 'Penal'
            },
            {
                id: 7,
                type: 'Social'
            },
        ];
        await repository.save(typesOfSentences);

    }
}

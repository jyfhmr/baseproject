import { HttpException, Injectable } from '@nestjs/common';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { UpdateSentenceDto } from './dto/update-sentence.dto';
import salasData from './salasData';
import { InjectRepository } from '@nestjs/typeorm';
import { Sentence } from './entities/sentence.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SentencesService {
    constructor(
        @InjectRepository(Sentence) // Inyectar el repositorio
        private sentencesRepository: Repository<Sentence>,
    ) { }

    create(createSentenceDto: CreateSentenceDto) {
        return 'This action adds a new sentence';
    }

    findAll() {
        return `This action returns all sentences`;
    }

    findOne(id: number) {
        return `This action returns a #${id} sentence`;
    }

    update(id: number, updateSentenceDto: UpdateSentenceDto) {
        return `This action updates a #${id} sentence`;
    }

    remove(id: number) {
        return `This action removes a #${id} sentence`;
    }

    async createSentences() {
        for (let sala in salasData) {
            console.log('las sala', sala);

            for (let month in salasData[sala]) {
                console.log('el month', month);

                console.log(salasData[sala][month]);

                const objectWithSentencesPerMonthAndDate = salasData[sala][month];

                console.log(
                    'objeto con dias y sentencias de esos dias',
                    objectWithSentencesPerMonthAndDate,
                );

                for (let day in objectWithSentencesPerMonthAndDate) {
                    console.log(
                        'Un día y sus sentencias ',
                        objectWithSentencesPerMonthAndDate[day],
                    );

                    console.log('el date', month, objectWithSentencesPerMonthAndDate[day].date);

                    const year = 2024;

                    const meses = {
                        Enero: 0,
                        Febrero: 1,
                        Marzo: 2,
                        Abril: 3,
                        Mayo: 4,
                        Junio: 5,
                        Julio: 6,
                        Agosto: 7,
                        Septiembre: 8,
                        Octubre: 9,
                        Noviembre: 10,
                        Diciembre: 11,
                    };

                    const mesNumerico = meses[month];
                    // Crear un objeto Date con la fecha completa
                    const fechaCompleta = new Date(
                        year,
                        mesNumerico,
                        objectWithSentencesPerMonthAndDate[day].date,
                    );

                    console.log(fechaCompleta);

                    const sentences = objectWithSentencesPerMonthAndDate[day].sentences

                    for (let i = 0; i < sentences.length; i++) {
                        let sentence = sentences[i];

                        const newSentence = this.sentencesRepository.create({
                            dateE: fechaCompleta,
                            choice: sentence.choice,
                            exponent: sentence.speaker,
                            url: sentence.url_content,
                            parts: sentence.parts,
                            proceedings_number: sentence.proceedings_number,
                            proceedings_type: sentence.proceedings_type,
                            sala: sala,
                            sentence_number: sentence.sentence_number
                        });

                        await this.sentencesRepository.save(newSentence);

                        continue

                    }
                }
            }
        }
    }

    proof() {
        console.log('las sentencias', salasData);

        this.createSentences();
    }


    async findCertainSentences(sala: string, month: string) {
        console.log("Buscando para la sala y mes del año 2024", sala, month);

        try {
            

             // Mapa de los meses en español a sus valores numéricos correspondientes
        const monthsMap: { [key: string]: number } = {
            enero: 1,
            febrero: 2,
            marzo: 3,
            abril: 4,
            mayo: 5,
            junio: 6,
            julio: 7,
            agosto: 8,
            septiembre: 9,
            octubre: 10,
            noviembre: 11,
            diciembre: 12
        };
    
        // Verifica si el mes recibido es válido
        const monthNumber = monthsMap[month];
        if (!monthNumber) {
            throw new Error(`Mes inválido: ${month}`);
        }
    
        // Formato de la fecha para el filtro: '2024-MM-01'
        const dateFilter = `2024-${monthNumber.toString().padStart(2, '0')}`;
    
        // Realiza la consulta filtrando por el año 2024 y el mes correspondiente
        const sentencesThatMatch = await this.sentencesRepository.query(
            `
            SELECT * 
            FROM sentence 
            WHERE sala = ? 
            AND DATE_FORMAT(dateE, '%Y-%m') = ?
            `,
            [sala, dateFilter]
        );
    
        console.log(sentencesThatMatch);
        return sentencesThatMatch;

        } catch (error) {

            console.log("el error en el backend",error)

             throw new HttpException("Error fetching",500)
        }
    
       
    }
    
}

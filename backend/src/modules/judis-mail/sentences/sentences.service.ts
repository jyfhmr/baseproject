import { HttpException, Injectable } from '@nestjs/common';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { UpdateSentenceDto } from './dto/update-sentence.dto';
import salasData from './salasData';
import { InjectRepository } from '@nestjs/typeorm';
import { Sentence } from './entities/sentence.entity';
import { Repository } from 'typeorm';
import { TypesOfSentence } from '../types-of-sentences/entities/types-of-sentence.entity';

@Injectable()
export class SentencesService {
    constructor(
        @InjectRepository(Sentence) // Inyectar el repositorio
        private sentencesRepository: Repository<Sentence>,

        @InjectRepository(TypesOfSentence)
        private typesOfSentenceRepository: Repository<TypesOfSentence>
    ) {}

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
        // Suponiendo que 'salasData' es un objeto con datos como el que describes
        for (let sala in salasData) {
            console.log('las salas', sala);
    
            for (let month in salasData[sala]) {
                console.log('el mes', month);
    
                const objectWithSentencesPerMonthAndDate = salasData[sala][month];
                console.log(
                    'objeto con días y sentencias de esos días',
                    objectWithSentencesPerMonthAndDate,
                );
    
                for (let day in objectWithSentencesPerMonthAndDate) {
                    console.log(
                        'Un día y sus sentencias ',
                        objectWithSentencesPerMonthAndDate[day],
                    );
    
                    const fechaCompleta = new Date(
                        2024, // Año
                        this.getMonthNumber(month), // Método que convierte el nombre del mes en número
                        objectWithSentencesPerMonthAndDate[day].date, // Día
                    );
    
                    const sentences = objectWithSentencesPerMonthAndDate[day].sentences;
    
                    for (let i = 0; i < sentences.length; i++) {
                        const sentence = sentences[i];
    
                        // Obtener el tipo de sentencia correspondiente (esto depende de cómo almacenes la relación)
                        const sentenceType = await this.typesOfSentenceRepository.findOne({
                            where: { type: sala }, // Buscar el tipo de sentencia por nombre de sala
                        });
    
                        // Buscar si la sentencia ya existe
                        const existingSentence = await this.sentencesRepository.findOne({
                            where: { sentence_number: sentence.sentence_number }, // Asumimos que 'sentence_number' es único
                        });
    
                        if (existingSentence) {
                            // Si la sentencia ya existe, podemos decidir si la actualizamos o no.
                            console.log('La sentencia ya existe, no se crea nuevamente', existingSentence.sentence_number);
                        } else {
                            // Si no existe, se crea la nueva sentencia
                            const newSentence = this.sentencesRepository.create({
                                dateE: fechaCompleta,
                                choice: sentence.choice,
                                exponent: sentence.speaker,
                                url: sentence.url_content,
                                parts: sentence.parts,
                                proceedings_number: sentence.proceedings_number,
                                proceedings_type: sentence.proceedings_type,
                                type_of_sentence: sentenceType, // Aquí asignas el tipo de sentencia
                                sentence_number: sentence.sentence_number,
                            });
    
                            await this.sentencesRepository.save(newSentence);
                            console.log('Sentencia creada con éxito', sentence.sentence_number);
                        }
                    }
                }
            }
        }
    }
    
   
    // Método para convertir el nombre del mes en su número correspondiente
    private getMonthNumber(month: string): number {
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
        return meses[month] ?? 0; // Retorna el número del mes o 0 si no es válido
    }
   

    proof() {
        console.log('las sentencias', salasData);

        this.createSentences();
    }

    async findCertainSentences(sala: string, month: string) {
        console.log('Buscando para la sala y mes del año 2024', sala, month);
    
        // Normaliza el nombre de la sala (en minúsculas) al formato esperado en la base de datos
        sala = sala.replace(/_/g, '').toLowerCase(); // Elimina guiones bajos y pasa a minúsculas
        
        // Mapeo de las salas a su formato correcto
        const salaMap: { [key: string]: string } = {
            politicoadministrativa: 'PoliticoAdministrativa',
            plena: 'Plena',
            constitucional: 'Constitucional',
            // Asegúrate de agregar todos los valores posibles que necesitas
            electoral: 'Electoral',
            civil: 'Civil',
            penal: 'Penal',
            social: 'Social',
        };
    
        // Si la sala no existe en el mapa, lanzar error
        if (!salaMap[sala]) {
            throw new Error(`Sala no válida: ${sala}`);
        }
    
        // El nombre correcto de la sala (con mayúscula y sin guiones bajos)
        const salaCorrecta = salaMap[sala];
    
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
                diciembre: 12,
            };
    
            // Verifica si el mes recibido es válido
            const monthNumber = monthsMap[month.toLowerCase()]; // Asegúrate de que el mes esté en minúsculas
            if (!monthNumber) {
                throw new Error(`Mes inválido: ${month}`);
            }
    
            // Formato de la fecha para el filtro: '2024-MM-01'
            const dateFilter = `2024-${monthNumber.toString().padStart(2, '0')}`;
    
            // Obtener el id del tipo de sentencia correspondiente (por nombre de sala)
            const sentenceType = await this.typesOfSentenceRepository.findOne({
                where: { type: salaCorrecta }, // Usamos el nombre correcto de la sala
            });
    
            if (!sentenceType) {
                throw new Error(`Tipo de sentencia no encontrado para la sala: ${salaCorrecta}`);
            }
    
            // Realiza la consulta filtrando por el id de la sala y el mes
            const sentencesThatMatch = await this.sentencesRepository.query(
                `
                SELECT * 
                FROM sentence 
                WHERE typeOfSentenceId = ? 
                AND DATE_FORMAT(dateE, '%Y-%m') = ?
                `,
                [sentenceType.id, dateFilter],
            );
    
            console.log(sentencesThatMatch);
            return sentencesThatMatch;
        } catch (error) {
            console.log('el error en el backend', error);
            throw new HttpException('Error fetching', 500);
        }
    }



    // Método para obtener la cantidad de sentencias por tipo de sala
  async getSentencesBySala() {
    try {
      const sentencesBySala = await this.sentencesRepository
        .createQueryBuilder('sentence')
        .leftJoinAndSelect('sentence.type_of_sentence', 'type_of_sentence')
        .select('type_of_sentence.type AS type')
        .addSelect('COUNT(sentence.id) AS value')
        .groupBy('type_of_sentence.type')
        .getRawMany();

      return sentencesBySala.map((item) => ({
        type: item.type,
        value: parseInt(item.value, 10), // Aseguramos que el valor sea un número entero
      }));
    } catch (error) {
      console.log('Error al obtener las sentencias por tipo de sala', error);
      throw new Error('Error al obtener los datos de las sentencias.');
    }
  }



    
}

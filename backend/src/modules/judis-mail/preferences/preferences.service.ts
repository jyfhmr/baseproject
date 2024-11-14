import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/config/users/entities/user.entity';
import { preferences_per_user } from './entities/preference.entity';
import { TypesOfSentence } from '../types-of-sentences/entities/types-of-sentence.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(preferences_per_user)
    private preferencesRepository: Repository<preferences_per_user>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(TypesOfSentence)
    private typesOfSentenceRepository: Repository<TypesOfSentence>,
  ) { }


  create(createPreferenceDto: CreatePreferenceDto) {
    return 'This action adds a new preference';
  }



  async savePreferences(userId: number, preferences: string[]): Promise<number> {
    console.log("usuario y preferencias", userId, preferences);

    try {
      // Verificamos si el usuario existe
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('Usuario no encontrado', 404);
      }

      // Eliminar las preferencias existentes para este usuario
      await this.preferencesRepository.delete({ user }); // Borra las preferencias asociadas al usuario

      // Creamos las nuevas preferencias en la base de datos
      const preferencesToSave = preferences.map(async (preferenceName) => {
        // Buscamos la sentencia por nombre
        const preference = await this.typesOfSentenceRepository.findOne({
          where: { type: preferenceName }, // Buscamos por nombre de la sentencia (tipo)
        });

        if (!preference) {
          // Si no encontramos la preferencia, lanzamos un error
          throw new HttpException(`Preferencia no encontrada: ${preferenceName}`, HttpStatus.NOT_FOUND);
        }

        // Creamos el registro de preferencia
        const preferenceRecord = this.preferencesRepository.create({
          user,
          preference,
        });

        // Guardamos la preferencia
        await this.preferencesRepository.save(preferenceRecord);
      });

      // Guardamos todas las preferencias de manera paralela
      await Promise.all(preferencesToSave);

      console.log('Preferencias guardadas con éxito');
      return HttpStatus.CREATED; // 201

    } catch (error) {
      console.error("Error guardando las preferencias", error);

      // Lanzamos una excepción HTTP si algo salió mal
      throw new HttpException('Error guardando las preferencias', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async getPreferencesByUserId(userId: number): Promise<string[]> {
    try {
      // Verificamos si el usuario existe
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // Buscar las preferencias asociadas al usuario, utilizando QueryBuilder
      const preferences = await this.preferencesRepository
        .createQueryBuilder('preferences')
        .leftJoinAndSelect('preferences.preference', 'preference') // Relacionamos con la entidad 'TypesOfSentence'
        .where('preferences.userId = :userId', { userId }) // Filtramos por el usuario
        .getMany();

      // Extraemos los tipos de sentencias de las preferencias encontradas
      const preferenceNames = preferences.map(preference => preference.preference.type);

      console.log('Retornando preferencias:', preferenceNames);

      return preferenceNames; // Devolvemos un arreglo con los tipos de sentencias
    } catch (error) {
      console.error('Error al obtener las preferencias del usuario', error);
      throw new HttpException('Error al obtener las preferencias del usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  findAll() {
    return `This action returns all preferences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} preference`;
  }

  update(id: number, updatePreferenceDto: UpdatePreferenceDto) {
    return `This action updates a #${id} preference`;
  }

  remove(id: number) {
    return `This action removes a #${id} preference`;
  }
}

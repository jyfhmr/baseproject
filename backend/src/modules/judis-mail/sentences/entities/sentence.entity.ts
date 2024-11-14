import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TypesOfSentence } from '../../types-of-sentences/entities/types-of-sentence.entity';
import { User } from 'src/modules/config/users/entities/user.entity';

@Entity()
export class Sentence {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dateE: Date

    @Column()
    choice: string

    //conexion con la tabla pivote
    @Column()
    parts: string 

    @Column()
    exponent: string 

    @Column()
    url: string 

    @Column()
    proceedings_number: string

    @Column()
    proceedings_type: string


    @Column()
    sala: string


    @Column()
    sentence_number: string

    @ManyToOne(() => TypesOfSentence)
    type_of_sentence: TypesOfSentence;

    @CreateDateColumn()
    createdAt: Date;

}

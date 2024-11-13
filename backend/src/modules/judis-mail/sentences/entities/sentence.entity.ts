import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

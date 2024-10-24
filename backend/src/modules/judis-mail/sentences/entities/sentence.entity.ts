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
    exponent: string 

    @Column()
    url: string 

    @Column()
    description: string
}

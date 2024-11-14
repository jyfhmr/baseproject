import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TypesOfSentence {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string


}

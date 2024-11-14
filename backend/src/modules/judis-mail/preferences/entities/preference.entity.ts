import { User } from "src/modules/config/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TypesOfSentence } from "../../types-of-sentences/entities/types-of-sentence.entity";

@Entity()
export class preferences_per_user {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() =>TypesOfSentence)
    preference: TypesOfSentence;

}

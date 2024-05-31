import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Note } from "./Note";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  hashedPassword: string;

  @OneToMany(() => Note, (note) => note._owner)
  notes: Note[];
}

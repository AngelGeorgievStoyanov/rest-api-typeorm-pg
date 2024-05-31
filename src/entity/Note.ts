import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Note {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  createdAt: string;

  @Column({ nullable: true })
  editedAt: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true })
  completedAt: string;

  @ManyToOne(() => User, user => user.notes)
  _owner: User;
}

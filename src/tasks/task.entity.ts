import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TaskStatus } from './task.model';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  desciption: string;

  @Column()
  status: TaskStatus;
}

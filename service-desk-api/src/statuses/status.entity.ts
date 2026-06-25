import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('statuses')
export class Status {

  @PrimaryGeneratedColumn()
  id_status!: number;

  @Column()
  name!: string;
}
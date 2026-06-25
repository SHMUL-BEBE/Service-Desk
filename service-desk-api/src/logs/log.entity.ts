import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('action_log')
export class Log {

  @PrimaryGeneratedColumn()
  id_action!: number;

  @Column()
  id_user!: number;

  @Column()
  action!: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at!: Date;
}
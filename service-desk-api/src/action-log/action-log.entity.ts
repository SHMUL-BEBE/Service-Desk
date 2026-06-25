import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('action_log')
export class ActionLog {

  @PrimaryGeneratedColumn()
  id_action!: number;

  @Column()
  id_user!: number;

  @Column({ length: 255 })
  action!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_user' })
  user!: User;
}
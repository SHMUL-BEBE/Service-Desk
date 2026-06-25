import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('comments')
export class Comment {

  @PrimaryGeneratedColumn()
  id_comment!: number;

  @Column({ name: 'id_request' })
  id_request!: number;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('requests')
export class Request {

  @PrimaryGeneratedColumn()
  id_request!: number;

  @Column()
  id_client!: number;

  @Column()
  id_engineer!: number;

  @Column()
  id_equipment!: number;

  @Column()
  id_category!: number;

  @Column()
  id_status!: number;

  @Column({ length: 255, nullable: true })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
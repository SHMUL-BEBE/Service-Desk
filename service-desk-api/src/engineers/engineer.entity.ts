import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('engineers')
export class Engineer {

  @PrimaryGeneratedColumn()
  id_engineer!: number;

  @Column({ length: 100 })
  full_name!: string;

  @Column({ length: 100, nullable: true })
  specialization!: string;

  @Column({ name: 'id_user', nullable: true })
  id_user!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_user' })
  user!: User;
}
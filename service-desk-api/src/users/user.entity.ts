import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id_user!: number;

  @Column({ length: 50, unique: true })
  login!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ length: 30 })
  role!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
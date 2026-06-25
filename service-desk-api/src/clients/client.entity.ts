import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id_client!: number;

  @Column({ length: 100 })
  full_name!: string;

  @Column({ length: 20 })
  phone!: string;

  @Column({ length: 100 })
  email!: string;

  @Column({ length: 50, unique: true })
  login!: string;

  @Column({ length: 255 })
  password!: string;
}
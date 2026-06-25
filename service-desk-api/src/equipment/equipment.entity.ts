import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('equipment')
export class Equipment {

  @PrimaryGeneratedColumn()
  id_equipment!: number;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  model!: string;

  @Column({ nullable: true })
  serial_number!: string;
}
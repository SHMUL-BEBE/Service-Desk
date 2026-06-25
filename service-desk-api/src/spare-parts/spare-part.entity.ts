// src/spare-parts/spare-part.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('spare_parts')
export class SparePart {

  @PrimaryGeneratedColumn()
  id_part!: number;

  @Column({ length: 100 })
  name!: string;

  @Column()
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;
}
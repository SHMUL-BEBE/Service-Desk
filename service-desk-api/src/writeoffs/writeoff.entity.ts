// src/writeoffs/writeoff.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('write_offs')
export class WriteOff {

  @PrimaryGeneratedColumn()
  id_writeoff!: number;

  @Column({ name: 'id_request' })
  request_id!: number;

  @Column({ name: 'id_part' })
  part_id!: number;

  @Column()
  quantity!: number;
}
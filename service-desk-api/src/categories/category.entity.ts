import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('service_categories')
export class Category {

  @PrimaryGeneratedColumn()
  id_category!: number;

  @Column({
    length: 100
  })
  name!: string;

  @Column({
    length: 255,
    nullable: true
  })
  description!: string;
}
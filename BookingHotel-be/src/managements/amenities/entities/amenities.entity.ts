import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity({ name: 'amenities' })
export class Amenity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'nvarchar', length: 100, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'nvarchar', nullable: true })
  description?: string;

 
}

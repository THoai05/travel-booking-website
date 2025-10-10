import { City } from 'src/managements/city/entities/city.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'hotels' })
export class Hotel {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'nvarchar', length: 100, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'nvarchar', nullable: true })
  description?: string;

  @Column({ name: 'address', type: 'nvarchar', length: 255, nullable: false })
  address: string;


  @Column({ name: 'country', type: 'nvarchar', length: 100, nullable: false })
  country: string;

  @Column({ name: 'phone', type: 'nvarchar', length: 20, nullable: false })
  phone: string;

  @Column({ name: 'policies', type: 'nvarchar', nullable: true })
  policies?: string;

  @Column({ name: 'check_in_time', type: 'time', nullable: true })
  checkInTime?: string;

  @Column({ name: 'check_out_time', type: 'time', nullable: false })
  checkOutTime: string;

  @ManyToOne(() => City, (city) => city.hotels)
  @JoinColumn({name:'cityId'})
  city: City

  @Column({
    type: 'bit',
    default:true
  })
  isFeatured:boolean
  
  @Column({ name: 'cityId', type: 'int' })
  cityId: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}

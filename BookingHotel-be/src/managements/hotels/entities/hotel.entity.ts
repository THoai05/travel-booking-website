import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'hotels' })
export class Hotel {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ name: 'city', type: 'varchar', length: 100, nullable: false })
  city: string;

  @Column({ name: 'country', type: 'varchar', length: 100, nullable: false })
  country: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: false })
  phone: string;

  @Column({ name: 'policies', type: 'text', nullable: true })
  policies?: string;

  @Column({ name: 'check_in_time', type: 'time', nullable: true })
  checkInTime?: string;

  @Column({ name: 'check_out_time', type: 'time', nullable: false })
  checkOutTime: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}

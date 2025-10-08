import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hotel_id: number;

  @Column()
  room_number: string;

  @Column()
  room_type: string;

  @Column('decimal')
  price_per_night: number;

  @Column()
  max_guests: number;

  @Column()
  status: string;
}

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Booking } from '../../bookings/entities/booking.entity';

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

  // relation tới Hotel
  @ManyToOne(() => Hotel, hotel => hotel.rooms)
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  // relation ngược với Booking
  @OneToMany(() => Booking, booking => booking.room)
  bookings: Booking[];
}

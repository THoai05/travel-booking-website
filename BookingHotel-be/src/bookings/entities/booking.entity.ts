import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  room_id: number;

  @Column({ type: 'date' })
  check_in_date: string;

  @Column({ type: 'date' })
  check_out_date: string;

  @Column()
  guests_count: number;

  @Column()
  status: string;

  @Column('decimal')
  total_price: number;

  // relation tới Room
  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room: Room;
}

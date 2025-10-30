// favourites.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../../managements/users/entities/users.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Room } from '../../rooms/entities/rooms.entity';

@Entity()
export class Favourite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favourites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Hotel, (hotel) => hotel.favourites, { nullable: true, onDelete: 'CASCADE' })
  hotel: Hotel;

  @ManyToOne(() => Room, (room) => room.favourites, { nullable: true, onDelete: 'CASCADE' })
  room: Room;

  @CreateDateColumn()
  createdAt: Date;
}

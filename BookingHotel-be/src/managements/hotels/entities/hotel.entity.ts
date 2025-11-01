import { City } from 'src/managements/city/entities/city.entity';
import { Review } from 'src/managements/reviews/entities/review.entity';
import { Room } from 'src/managements/rooms/entities/rooms.entity';
import { Amenity } from 'src/managements/amenities/entities/amenities.entity';
import { Favourite } from 'src/managements/favourite/entities/favourite.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { RoomType } from 'src/managements/rooms/entities/roomType.entity';

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
  @JoinColumn({ name: 'cityId' })
  city: City;

  @OneToMany(() => Favourite, favourite => favourite.hotel)
  favourites: Favourite[];


  @Column({ type: 'bit', default: true })
  isFeatured: boolean;

  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];

  @OneToMany(() => Review, (review) => review.hotel)
  reviews: Review[];

  @Column({ name: 'cityId', type: 'int' })
  cityId: number;

  @ManyToMany(() => Amenity, (amenity) => amenity.hotels)
  @JoinTable({
    name: 'hotels_amenities', // 👈 tên bảng trung gian
    joinColumn: { name: 'hotel_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'amenity_id', referencedColumnName: 'id' },
  })
  amenities: Amenity[];

  @Expose()
  avgRating?: number;


  @Column({
    type: 'decimal',  // hoặc float, nhưng decimal chính xác hơn cho tiền
    precision: 12,
    scale: 2,
    nullable: true,
  })
  avgPrice: number | null;

  @OneToMany(() => RoomType, (roomType) => roomType.hotel)
  roomTypes:RoomType[]

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}

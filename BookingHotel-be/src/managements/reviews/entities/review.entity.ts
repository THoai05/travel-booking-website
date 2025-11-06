import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';
import { Hotel } from 'src/managements/hotels/entities/hotel.entity';
import { ReviewLike } from './review-like.entity';

export enum ReviewType {
  HOTEL = 'hotel',
  ROOM = 'room',
}

@Entity('reviews')
@Check(`"rating" >= 1 AND "rating" <= 5`)
@Index(['user', 'hotel'])
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Hotel, (hotels) => hotels.reviews, { onDelete: 'CASCADE' })
  hotel: Hotel;

  @OneToMany(() => ReviewLike, (like) => like.review)
  reviewLikes: ReviewLike[];

  @OneToMany(() => ReviewLike, (like) => like.review)
  likes: ReviewLike[];

  @Column({ type: 'tinyint', unsigned: true })
  rating: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string | null;

  @Column({
    type: 'enum',
    enum: ReviewType,
    nullable: false,
  })
  reviewType: ReviewType;

  @Column({ type: 'json', nullable: true })
  images: string[] | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}

import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';
import { Review } from './review.entity';

@Entity('review_likes')
@Unique(['user', 'review'])
export class ReviewLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviewLikes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Review, (review) => review.reviewLikes, { onDelete: 'CASCADE' })
  review: Review;

  @CreateDateColumn()
  createdAt: Date;
}

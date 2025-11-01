import { Booking } from "src/managements/bookings/entities/bookings.entity";
import { Notification } from "src/managements/notifications/entities/notification.entity";
import { Review } from "src/managements/reviews/entities/review.entity";
import { ResetPassword } from 'src/managements/reset_Password/entities/reset_Password.entity';
import { Post } from 'src/managements/posts/entities/post.entity';
import { Favourite } from 'src/managements/favourite/entities/favourite.entity';
import { ReviewLike } from 'src/managements/reviews/entities/review-like.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum MembershipLevel {
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINUM = 'Platinum',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'username', type: 'nvarchar', length: 50, nullable: false })
  username: string;

  @Column({ name: 'password', type: 'nvarchar', length: 255, nullable: false })
  password: string;

  @Column({ name: 'full_name', type: 'nvarchar', length: 100, nullable: false })
  fullName: string;

  @Column({ name: 'email', type: 'nvarchar', length: 100, unique: true, nullable: false })
  email: string;

  @Column({ name: 'phone', type: 'nvarchar', length: 20, nullable: false })
  phone: string;

  @Column({
    name: 'role',
    type: 'nvarchar',
    nullable: false,
  })
  role: UserRole;

  @Column({ name: 'avatar', type: 'nvarchar', nullable: true })
  avatar?: string;

  @Column({ name: 'dob', type: 'date', nullable: true })
  dob?: Date;

  @Column({
    name: 'gender',
    type: 'nvarchar',
    nullable: true,
  })
  gender?: Gender;

  @Column({
    name: 'loyalty_points',
    type: 'int',
    default: 0,
    nullable: false,
  })
  loyaltyPoints: number;

  @Column({
    name: 'membership_level',
    type: 'nvarchar',
    default: MembershipLevel.SILVER,
    nullable: false,
  })
  membershipLevel: MembershipLevel;


  @OneToMany(() => ResetPassword, (resetPassword) => resetPassword.user)
  resetPasswords: ResetPassword[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Favourite, favourite => favourite.user)
  favourites: Favourite[];


  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[]

  @OneToMany(() => ReviewLike, (like) => like.user)
  reviewLikes: ReviewLike[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[]

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}

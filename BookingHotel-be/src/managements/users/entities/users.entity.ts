import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}

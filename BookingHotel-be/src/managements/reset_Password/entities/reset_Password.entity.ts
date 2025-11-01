import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';

@Entity('reset_password')
export class ResetPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.resetPasswords, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'varchar', length: 100, unique: true })
  token: string;

  @Column({ type: 'datetime' })
  expires_at: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}

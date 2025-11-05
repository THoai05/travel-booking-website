import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';
import { City } from 'src/managements/city/entities/city.entity';
import { PostImage } from './post_images';

@Entity('blog_posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ nullable: true })
  author_id: number;

  @ManyToOne(() => City, (city) => city.posts, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City | null;

  @Column({ nullable: true })
  city_id: number | null;

  @OneToMany(() => PostImage, image => image.post, { cascade: true }) //cho phép khi tạo Post kèm images
  images: PostImage[];

  @Column({ default: true })
  is_public: boolean;

  @Column({ length: 255, unique: true })
  slug: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

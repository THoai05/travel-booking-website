import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';

@Entity('blog_posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  // @ManyToOne(() => User, (user) => user.posts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ nullable: true })
  author_id: number;

  // 🖼 Ảnh đại diện cho bài post
  @Column({ nullable: true })
  image: string;

  // 🌍 Công khai hay ẩn
  @Column({ default: true })
  is_public: boolean;

  // 🔗 Slug (đường dẫn thân thiện SEO, ví dụ: "du-lich-da-lat-2025")
  @Column({ length: 255, unique: true })
  slug: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

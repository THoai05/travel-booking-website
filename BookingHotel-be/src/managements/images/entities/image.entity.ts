import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ImageAttachment } from './image_attachment.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  caption?: string;

  @Column({ nullable: true })
  alt?: string;

  @Column({ type: 'text', nullable: true })
  description?: string; // ✅ thêm dòng này để seed không lỗi

  @Column({
    default:false
  })
  isMain:boolean

  @OneToMany(() => ImageAttachment, (attachment) => attachment.image, {
    cascade: true,
  })
  attachments: ImageAttachment[];
}

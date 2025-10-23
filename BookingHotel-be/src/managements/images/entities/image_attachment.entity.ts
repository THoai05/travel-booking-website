import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Image } from './image.entity';

@Entity()
export class ImageAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Image, (image) => image.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'imageId' })
  image: Image;

  // Dạng entity mà ảnh này gắn vào (VD: 'hotel', 'room', 'city')
  @Column()
  targetType: 'hotel' | 'room' | 'city';

  // ID của entity đó
  @Column()
  targetId: number;
}

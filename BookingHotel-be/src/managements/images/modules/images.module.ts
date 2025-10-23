import { Module } from '@nestjs/common';
import { ImagesService } from '../services/images.service';
import { ImagesController } from '../controllers/images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../entities/image.entity';
import { ImageAttachment } from '../entities/image_attachment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Image,ImageAttachment])],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports:[ImagesService]
})
export class ImagesModule {}

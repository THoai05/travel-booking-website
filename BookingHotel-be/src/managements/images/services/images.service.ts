import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { ImageAttachment } from '../entities/image_attachment.entity';

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepo: Repository<Image>,
        @InjectRepository(ImageAttachment)
        private readonly imageAttachmentRepo: Repository<ImageAttachment>) {}
    
   async getImagesByTypeAndId(
  targetType: string, 
  targetId: number
): Promise<{ data: { url: string; description: string ,isMain:boolean}[]; total: number }> {
    
    console.log("Đang tìm kiếm với:", targetType, targetId);

    const queryBuilder = this.imageAttachmentRepo
        .createQueryBuilder('imageAtt')
        .leftJoin('imageAtt.image', 'image')
        .where('imageAtt.targetType = :targetType', { targetType })
        .andWhere('imageAtt.targetId = :targetId', { targetId });

    // Lấy TỔNG SỐ LƯỢNG
    const total = await queryBuilder.getCount();

    // Lấy DỮ LIỆU THÔ
       let rawData: { url: string | null; description: string | null;  isMain:boolean}[] = [];
    if (total > 0) {
        rawData = await queryBuilder
            .select([
                'image.url AS url', 
                'image.description AS description',
                'image.isMain AS isMain'
            ])
            .getRawMany<{ url: string | null; description: string | null ;isMain:boolean}>();
    }

    // *** BRO CHECK KỸ LOG NÀY ***
    // TUI CÁ LÀ NÓ SẼ RA (8 cái null) VÀ 8
    console.log("Dữ liệu thô và tổng:", rawData, total); 

    const mappedData = rawData.map(d => ({
        url: d.url || "", // Xử lý nếu url cũng có thể null
        description: d.description || "",
        isMain:d.isMain
    }));

    return {
        data: mappedData,
        total
    };
}
}

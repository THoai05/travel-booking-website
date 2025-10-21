import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';

import { Gender } from '../entities/users.entity'; // ✅ thêm dòng này

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // ====================== GET USER BY ID ======================
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    const { password, ...result } = user;
    return { user: result }; // trả về object có key 'user' để frontend dễ dùng
  }


  // ====================== UPDATE PROFILE ======================
  @Patch(':id')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      fullName?: string;
      email?: string;
      phone?: string;
      dob?: Date;
      gender?: string;
    },
  ) {
    const updateData: any = { ...body };

    // ✅ Chuyển chuỗi sang enum Gender
    if (body.gender) {
      const genderValue = body.gender.toLowerCase();
      if (genderValue === 'male') updateData.gender = Gender.MALE;
      else if (genderValue === 'female') updateData.gender = Gender.FEMALE;
      else updateData.gender = Gender.OTHER;
    }

    // ✅ Gọi service update
    const updatedUser = await this.usersService.updateUser(id, updateData);
    const { password, ...result } = updatedUser;
    return { message: 'Cập nhật thông tin thành công', user: result };
  }


  // ====================== UPLOAD AVATAR ======================

  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(__dirname, '../../../../uploads/tmp');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const name = `avatar-${Date.now()}${ext}`;
          cb(null, name);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Chỉ cho phép upload file hình ảnh'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Vui lòng chọn file');

    try {
      const tmpPath = file.path; // file tạm
      const avatarsPath = path.join(process.cwd(), '../bookinghotel-fe/public/avatars');
      const resizedFileName = `resized-${file.filename.split('.')[0]}.webp`;
      const resizedFilePath = path.join(avatarsPath, resizedFileName);

      // Tạo thư mục public/avatars nếu chưa có
      if (!fs.existsSync(avatarsPath)) fs.mkdirSync(avatarsPath, { recursive: true });

      // Không cho phép upload ảnh đã xử lý
      if (file.originalname.startsWith('resized-')) {
        fs.unlinkSync(tmpPath);
        throw new BadRequestException('Ảnh này đã được xử lý, vui lòng chọn ảnh khác!');
      }

      // Kiểm tra kích thước
      const metadata = await sharp(tmpPath).metadata();
      if (metadata.width < 200 || metadata.height < 200) {
        fs.unlinkSync(tmpPath);
        throw new BadRequestException('Ảnh quá nhỏ (tối thiểu 200x200 pixel)');
      }

      // Xóa avatar cũ
      const user = await this.usersService.findById(id);
      if (user?.avatar) {
        const oldFile = path.join(avatarsPath, path.basename(user.avatar));
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      }

      // Resize ảnh mới và chuyển vào public/avatars
      await sharp(tmpPath)
        .resize(200, 200)
        .toFormat('webp')
        .webp({ quality: 80 })
        .toFile(resizedFilePath);

      // Xóa file tạm
      fs.unlinkSync(tmpPath);

      // Cập nhật DB
      const avatarUrl = `/avatars/${resizedFileName}`;
      const updatedUser = await this.usersService.updateUser(id, { avatar: avatarUrl });
      const { password, ...result } = updatedUser;

      return { message: 'Upload avatar thành công', user: result, avatarUrl };
    } catch (err: any) {
      console.error('❌ Lỗi xử lý ảnh:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        throw new BadRequestException('Kích thước ảnh không được vượt quá 5 MB');
      }
      throw new BadRequestException(err.message || 'Không thể xử lý ảnh');
    }
  }

  // Lấy tất cả người dùng
  @Get()
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return { message: 'Danh sách người dùng', users };
  }
}

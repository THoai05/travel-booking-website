import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './create-hotel.dto';

// PartialType sẽ biến tất cả các trường của CreateHotelDto thành Optional
// nhưng vẫn giữ nguyên các Validate (Trim, MaxLength...)
export class UpdateHotelDto extends PartialType(CreateHotelDto) {}
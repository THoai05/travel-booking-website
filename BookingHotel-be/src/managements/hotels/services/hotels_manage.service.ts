import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Hotel } from '../entities/hotel.entity';
// Import đúng đường dẫn req mà ông yêu cầu
import { CreateHotelDto } from '../dtos/req/create-hotel.dto';
import { UpdateHotelDto } from '../dtos/req/update-hotel.dto';
import { Amenity } from 'src/managements/amenities/entities/amenities.entity';
import { City } from '../../city/entities/city.entity';

@Injectable()
export class HotelManageService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepo: Repository<Hotel>,

    @InjectRepository(Amenity)
    private amenityRepo: Repository<Amenity>,

    @InjectRepository(City)
    private cityRepo: Repository<City>,
  ) {}

  // ===================== HELPER METHODS =====================
  
  // Hàm này fix Bug 1, 3, 14: Check tồn tại trước khi làm gì đó
  private async checkHotelExist(id: number): Promise<Hotel> {
    // Fix Bug 10: Param URL tào lao (id=abc, id=undefined)
    if (!id || isNaN(id) || id <= 0) {
        throw new BadRequestException('ID khách sạn không hợp lệ');
    }

    const hotel = await this.hotelRepo.findOne({
      where: { id },
      relations: ['city', 'amenities', 'roomTypes', 'reviews', 'rooms'],
    });

    if (!hotel) throw new NotFoundException('Khách sạn không tồn tại hoặc đã bị xóa.');
    return hotel;
  }

  // ===================== MAIN METHODS =====================

  // CREATE HOTEL
  async create(dto: CreateHotelDto) {
    // 1. Check trùng lặp Hotel (Name + Address)
    const duplicate = await this.hotelRepo.findOne({
        where: { name: dto.name, address: dto.address }
    });
    if (duplicate) {
        throw new ConflictException('Khách sạn này đã tồn tại.');
    }

    // 2. Validate City
    const city = await this.cityRepo.findOneBy({ id: dto.cityId });
    if (!city) throw new NotFoundException('Thành phố không tồn tại');

    // 3. Map Amenities (Tiện ích)
    let amenities: Amenity[] = [];
    if (dto.amenities && dto.amenities.length > 0) {
      amenities = await this.amenityRepo.find({
        where: { id: In(dto.amenities) },
      });
      if (amenities.length !== dto.amenities.length) {
          throw new BadRequestException('Một số amenities ID không hợp lệ.');
      }
    }

    // 4. Tạo Object Hotel (Kèm theo RoomTypes và RatePlans)
    // Nhờ DTO đã map đúng cấu trúc và Entity có cascade: true
    // Ta chỉ cần spread dto vào là xong.
    const hotel = this.hotelRepo.create({
      ...dto,       // Bao gồm cả roomTypes (và ratePlans bên trong nó)
      amenities,
      city,
    });

    // 5. Save (TypeORM sẽ tự động lưu Deep Insert: Hotel -> RoomTypes -> RatePlans)
    try {
        return await this.hotelRepo.save(hotel);
    } catch (error) {
        // Bắt lỗi nếu dữ liệu RoomType/RatePlan bị sai định dạng SQL
        throw new BadRequestException('Lỗi khi lưu dữ liệu phòng: ' + error.message);
    }
  }

  // GET ALL + PAGINATION
  async findAll(page = 1, limit = 10) {
    // Fix Bug 10: Param URL page=abc hoặc page âm
    const safePage = Number(page) > 0 ? Number(page) : 1;
    const safeLimit = Number(limit) > 0 && Number(limit) <= 100 ? Number(limit) : 10;

    const [data, total] = await this.hotelRepo.findAndCount({
      take: safeLimit,
      skip: (safePage - 1) * safeLimit,
      relations: ['city', 'amenities', 'roomTypes'], 
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      page: safePage,
      totalItems: total,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  // GET ONE
  async findOne(id: number) {
    return await this.checkHotelExist(id);
  }

  // UPDATE
  async update(id: number, dto: UpdateHotelDto) {
    // Fix Bug 2 & 3: Không tìm thấy thì báo lỗi luôn, ko chạy tiếp
    const hotel = await this.checkHotelExist(id);

    // Check trùng tên nếu có sửa tên (Tránh trùng với KS khác)
    if (dto.name && dto.name !== hotel.name) {
        const duplicate = await this.hotelRepo.findOne({
            where: { name: dto.name, address: dto.address ?? hotel.address, id: Not(id) }
        });
        if (duplicate) throw new ConflictException('Tên khách sạn đã được sử dụng bởi địa điểm khác.');
    }

    // Check City nếu có update
    let newCity = hotel.city;

if (dto.cityId && dto.cityId !== hotel.cityId) {
    const found = await this.cityRepo.findOneBy({ id: dto.cityId });
    if (!found) throw new NotFoundException('City mới không tồn tại');
    newCity = found; // TS hiểu found là City
}

    // Fix Bug 13: 
    // Nếu dto.amenities là undefined (không gửi lên) -> Giữ nguyên amenities cũ (hotel.amenities)
    // Nếu dto.amenities là [] (gửi lên rỗng) -> Xóa hết amenities
    // Nếu dto.amenities là [1,2] -> Update mới
    let amenities = hotel.amenities;
    if (dto.amenities !== undefined) { 
       // Chỉ query khi người dùng thực sự gửi field này lên
       if (dto.amenities.length > 0) {
          amenities = await this.amenityRepo.find({
            where: { id: In(dto.amenities) },
          });
       } else {
          amenities = []; // Gửi mảng rỗng nghĩa là muốn xóa hết tiện ích
       }
    }

    // Merge dữ liệu an toàn
    const updatedHotel = this.hotelRepo.merge(hotel, {
      ...dto,
      city: newCity,
      amenities,
    });

    return await this.hotelRepo.save(updatedHotel);
  }

  // DELETE
  async remove(id: number) {
    // Fix Bug 1: Check tồn tại trước. Tab 1 xóa rồi thì Tab 2 sẽ tạch ở đây.
    await this.checkHotelExist(id);
    
    await this.hotelRepo.delete(id);
    
    return { message: 'Xóa khách sạn thành công' };
  }
}
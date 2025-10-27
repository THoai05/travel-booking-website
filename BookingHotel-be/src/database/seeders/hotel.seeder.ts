import { DataSource } from 'typeorm';
import { setSeederFactory, Seeder } from 'typeorm-extension';
import { faker as fakerVI } from '@faker-js/faker/locale/vi';
import { Hotel } from '../../managements/hotels/entities/hotel.entity';
import { City } from '../../managements/city/entities/city.entity';
import { RoomType, RoomTypeName } from '../../managements/rooms/entities/roomType.entity';
import { RatePlan } from '../../managements/rooms/entities/ratePlans.entity';

export default class HotelSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const hotelRepo = dataSource.getRepository(Hotel);
    const cityRepo = dataSource.getRepository(City);
    const roomTypeRepo = dataSource.getRepository(RoomType);
    const ratePlanRepo = dataSource.getRepository(RatePlan);

    // ========================
    // 🏙️ Load Cities
    // ========================
    const cities = await cityRepo.find();
    if (cities.length === 0) throw new Error('⚠️ No cities found! Please seed City first.');

    // ========================
    // 🏨 Create 200 Hotels
    // ========================
    const hotels: Hotel[] = [];
    const prefixes = ['Khách sạn', 'Resort'];
    const nameCores = [
      'Ánh Dương', 'Hoàng Gia', 'Biển Xanh', 'Golden Star', 'Hòa Bình', 'Kim Long', 'Sakura',
      'Ruby', 'Rex', 'Panorama', 'Lotus', 'Phương Nam', 'Ngọc Lan', 'Royal', 'Eden',
      'Sunrise', 'Blue Sky', 'Park View', 'Trăng Non', 'Central', 'Majestic', 'Cozy', 'An Phú',
      'Sunshine', 'Viễn Đông', 'Lê Lợi', 'Hạnh Phúc', 'Thiên An', 'Horizon', 'Ocean View',
      'Diamond', 'Golden Lotus', 'Green View', 'Morning Sun', 'Sea Breeze', 'Á Châu',
      'Hoàng Yến', 'Thiên Đường', 'Grand Palace', 'Riverside', 'Kim Cương', 'Bình Minh',
      'Sen Xanh', 'Phúc An', 'An Bình', 'Thành Đạt', 'Ngọc Minh', 'Phúc Lộc', 'Green Garden',
      'Central Palace', 'Lotus Lake'
    ];

    const randomHotelName = () => {
      const prefix = fakerVI.helpers.arrayElement(prefixes);
      const name = fakerVI.helpers.arrayElement(nameCores);
      return `${prefix} ${name}`;
    };

    const fakeVietnamPhoneNumber = () => {
      const prefixes = ['03', '05', '07', '08', '09'];
      const prefix = fakerVI.helpers.arrayElement(prefixes);
      const number = fakerVI.string.numeric(8);
      return prefix + number;
    };

    const fakeVietnamAddress = () => {
      const streetNumber = fakerVI.string.numeric(3);
      const streetName = fakerVI.location.street();
      const ward = fakerVI.helpers.arrayElement(['Phường 1', 'Phường 2', 'Phường 3']);
      const district = fakerVI.helpers.arrayElement([
        'Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận Bình Thạnh'
      ]);
      return `${streetNumber} ${streetName}, ${ward}, ${district}`;
    };

    for (let i = 0; i < 200; i++) {
      const hotel = new Hotel();
      const randomCity = fakerVI.helpers.arrayElement(cities);
      const rawPrice = fakerVI.number.int({ min: 300000, max: 5000000 });

      hotel.cityId = randomCity.id;
      hotel.name = randomHotelName();
      hotel.description = fakerVI.lorem.sentences(2);
      hotel.address = fakeVietnamAddress();
      hotel.country = 'Việt Nam';
      hotel.phone = fakeVietnamPhoneNumber();
      hotel.policies = fakerVI.lorem.paragraph();
      hotel.checkInTime = '14:00:00';
      hotel.checkOutTime = '12:00:00';
      hotel.avgPrice = Math.round(rawPrice / 1000) * 1000;
      hotel.isFeatured = fakerVI.datatype.boolean();

      hotels.push(hotel);
    }

    const savedHotels = await hotelRepo.save(hotels);
    console.log(`✅ Seeded ${savedHotels.length} hotels`);

    // ========================
    // 🛏️ Create RoomTypes
    // ========================
    const allRoomTypeNames = Object.values(RoomTypeName);
    const roomTypes: RoomType[] = [];

    for (const hotel of savedHotels) {
      const numRoomTypes = fakerVI.number.int({ min: 3, max: 5 });
      const usedNames = fakerVI.helpers.shuffle(allRoomTypeNames).slice(0, numRoomTypes);

      for (const name of usedNames) {
        const roomType = new RoomType();
        roomType.hotel = hotel;
        roomType.hotelId = hotel.id;
        roomType.name = name;
        roomType.description = fakerVI.lorem.sentences(2);
        roomType.max_guests = fakerVI.number.int({ min: 2, max: 6 });
        roomType.total_inventory = fakerVI.number.int({ min: 5, max: 30 });
        roomType.area = `${fakerVI.number.int({ min: 20, max: 60 })} m²`;
        roomType.bed_type = fakerVI.helpers.arrayElement([
          '1 double bed', '2 single beds', '1 king bed', '3 single beds'
        ]);
        roomTypes.push(roomType);
      }
    }

    const savedRoomTypes = await roomTypeRepo.save(roomTypes);
    console.log(`✅ Seeded ${savedRoomTypes.length} room types`);

    // ========================
    // 💰 Create RatePlans
    // ========================
   const ratePlans: RatePlan[] = [];
for (const roomType of savedRoomTypes) {
  const numPlans = fakerVI.number.int({ min: 1, max: 3 });
  for (let i = 0; i < numPlans; i++) {
    const plan = new RatePlan();
    plan.roomType = roomType;
    plan.roomTypeId = roomType.id;

    plan.name = fakerVI.helpers.arrayElement([
      'Standard Rate', 'Non-refundable', 'Breakfast Included', 'Early Bird', 'Last Minute'
    ]);

    // ✅ Thay vì plan.description, dùng các trường thật
    const basePrice = fakerVI.number.int({ min: 500000, max: 5000000 });
    plan.original_price = basePrice;
    plan.sale_price = Math.round(basePrice * fakerVI.number.float({ min: 0.7, max: 0.95 }));

    plan.includes_breakfast = fakerVI.datatype.boolean();
    plan.payment_policy = fakerVI.helpers.arrayElement([
      'PAY_NOW',
      'PAY_AT_HOTEL',
      'PAY_LATER',
    ]) as any;

    plan.cancellation_policy = fakerVI.helpers.arrayElement([
      'NON_REFUNDABLE',
      'FREE_CANCELLATION',
      'PAY_AT_HOTEL',
    ]) as any;

    plan.cancellation_deadline_days = fakerVI.number.int({ min: 1, max: 7 });
    ratePlans.push(plan);
  }
}

const savedPlans = await ratePlanRepo.save(ratePlans);
console.log(`✅ Seeded ${savedPlans.length} rate plans`);
  }
}

import { AppDataSource } from 'src/app-datasource';
import { setSeederFactory } from 'typeorm-extension';
import { Hotel } from '../../managements/hotels/entities/hotel.entity';
import { City } from '../../managements/city/entities/city.entity';
import { faker as fakerVI } from '@faker-js/faker/locale/vi';

// ========================
// 🔸 Prefix & tên chính
// ========================
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

// ========================
// 🔸 Helper functions
// ========================
function randomHotelName() {
  const prefix = fakerVI.helpers.arrayElement(prefixes);
  const name = fakerVI.helpers.arrayElement(nameCores);
  return `${prefix} ${name}`;
}

function fakeVietnamPhoneNumber() {
  const prefixes = ['03', '05', '07', '08', '09', '01'];
  const prefix = fakerVI.helpers.arrayElement(prefixes);
  const number = fakerVI.string.numeric(8);
  return prefix + number;
}

function fakeVietnamAddress() {
  const streetNumber = fakerVI.string.numeric(3);
  const streetName = fakerVI.location.street();
  const ward = fakerVI.helpers.arrayElement(['Phường 1', 'Phường 2', 'Phường 3']);
  const district = fakerVI.helpers.arrayElement([
    'Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận Bình Thạnh'
  ]);
  return `${streetNumber} ${streetName}, ${ward}, ${district}`;
}

// ========================
// 🔸 Seeder Factory
// ========================
export default setSeederFactory(Hotel, async () => {
  const hotel = new Hotel();

  const cityRepo = AppDataSource.getRepository(City);
  const cities = await cityRepo.find();
  const randomCity = fakerVI.helpers.arrayElement(cities);

  const rawPrice = fakerVI.number.int({ min: 300000, max: 5000000 });

  hotel.cityId = randomCity.id;
  hotel.name = randomHotelName();
  hotel.description = fakerVI.lorem.sentence();
  hotel.address = fakeVietnamAddress();
  hotel.country = 'Việt Nam';
  hotel.phone = fakeVietnamPhoneNumber();
  hotel.policies = fakerVI.lorem.paragraph();
  hotel.checkInTime = '14:00:00';
  hotel.checkOutTime = '12:00:00';
  hotel.avgPrice = Math.round(rawPrice / 1000) * 1000;

  return hotel;
});

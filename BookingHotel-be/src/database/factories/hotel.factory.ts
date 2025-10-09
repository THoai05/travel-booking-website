import { setSeederFactory } from 'typeorm-extension';
import { Hotel } from '../../managements/hotels/entities/hotel.entity';
import { faker as fakerVI } from '@faker-js/faker/locale/vi';

// Hàm sinh số điện thoại Việt Nam
function fakeVietnamPhoneNumber() {
  const prefixes = ['03','05','07','08','09','01'];
  const prefix = fakerVI.helpers.arrayElement(prefixes);
  const number = fakerVI.string.numeric(8);
  return prefix + number;
}

// Hàm sinh địa chỉ Việt Nam
function fakeVietnamAddress() {
  const streetNumber = fakerVI.string.numeric(3);
  const streetName = fakerVI.location.street();
  const ward = fakerVI.helpers.arrayElement(['Phường 1','Phường 2','Phường 3','Phường 4','Phường 5']);
  const district = fakerVI.helpers.arrayElement(['Quận 1','Quận 3','Quận 5','Quận 7','Quận Bình Thạnh']);
  const city = fakerVI.helpers.arrayElement([
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Nha Trang', 'Cần Thơ',
    'Huế', 'Đà Lạt', 'Vũng Tàu', 'Hải Phòng', 'Quảng Ninh'
  ]);
  return `${streetNumber} ${streetName}, ${ward}, ${district}, ${city}`;
}

export default setSeederFactory(Hotel, () => {
  const hotel = new Hotel();

  hotel.name = fakerVI.company.name();
  hotel.description = fakerVI.lorem.sentence();
  hotel.address = fakeVietnamAddress(); // ✅ dùng hàm custom
  hotel.city = fakerVI.helpers.arrayElement([
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Nha Trang', 'Cần Thơ',
    'Huế', 'Đà Lạt', 'Vũng Tàu', 'Hải Phòng', 'Quảng Ninh'
  ]);
  hotel.country = 'Việt Nam';
  hotel.phone = fakeVietnamPhoneNumber();
  hotel.policies = fakerVI.lorem.paragraph();
  hotel.checkInTime = '14:00:00';
  hotel.checkOutTime = '12:00:00';

  return hotel;
});

import { AppDataSource } from 'src/app-datasource';
import { setSeederFactory } from 'typeorm-extension';
import { Hotel } from '../../managements/hotels/entities/hotel.entity';
import { City } from '../../managements/city/entities/city.entity';
import { faker as fakerVI } from '@faker-js/faker/locale/vi';

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
  const district = fakerVI.helpers.arrayElement(['Quận 1', 'Quận 3', 'Quận 5']);
  return `${streetNumber} ${streetName}, ${ward}, ${district}`;
}

export default setSeederFactory(Hotel, async () => {
  const hotel = new Hotel();

  // ✅ Lấy DataSource trực tiếp
  const cityRepo = AppDataSource.getRepository(City);
  const cities = await cityRepo.find();

  const randomCity = fakerVI.helpers.arrayElement(cities);
  hotel.cityId = randomCity.id;

  hotel.name = fakerVI.company.name();
  hotel.description = fakerVI.lorem.sentence();
  hotel.address = fakeVietnamAddress();
  hotel.country = 'Việt Nam';
  hotel.phone = fakeVietnamPhoneNumber();
  hotel.policies = fakerVI.lorem.paragraph();
  hotel.checkInTime = '14:00:00';
  hotel.checkOutTime = '12:00:00';

  return hotel;
});

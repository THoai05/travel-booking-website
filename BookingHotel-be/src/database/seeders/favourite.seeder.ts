import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Favourite } from '../../managements/favourite/entities/favourite.entity';
import { User } from '../../managements/users/entities/users.entity';
import { Hotel } from '../../managements/hotels/entities/hotel.entity';
import { Room } from '../../managements/rooms/entities/rooms.entity';

export default class FavouriteSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<void> {
        const favouriteRepo = dataSource.getRepository(Favourite);
        const userRepo = dataSource.getRepository(User);
        const hotelRepo = dataSource.getRepository(Hotel);
        const roomRepo = dataSource.getRepository(Room);

        const users = await userRepo.find();
        const hotels = await hotelRepo.find({ relations: ['rooms'] });

        if (!users.length || !hotels.length) {
            console.log('⚠️  Cần có dữ liệu user, hotel (và room trong hotel) trước khi seed favourites');
            return;
        }

        const favourites: Favourite[] = [];

        // Hàm tạo ngày ngẫu nhiên trong vòng 30 ngày gần đây
        const randomDateWithinLastNDays = (n: number) => {
            const today = new Date();
            const pastTime =
                today.getTime() - Math.floor(Math.random() * n * 24 * 60 * 60 * 1000);
            return new Date(pastTime);
        };

        for (let i = 0; i < 500; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomHotel = hotels[Math.floor(Math.random() * hotels.length)];

            const isRoomFavourite = Math.random() > 0.5;
            const randomRoom =
                isRoomFavourite && randomHotel.rooms.length > 0
                    ? randomHotel.rooms[Math.floor(Math.random() * randomHotel.rooms.length)]
                    : undefined;

            const favourite = favouriteRepo.create({
                user: { id: randomUser.id },
                hotel: { id: randomHotel.id },
                room: randomRoom ? { id: randomRoom.id } : undefined,
                createdAt: randomDateWithinLastNDays(30), // <-- Sửa ở đây
            } as Partial<Favourite>);

            favourites.push(favourite);
        }

        await favouriteRepo.save(favourites);
        console.log(`🌱 Seeded ${favourites.length} favourites successfully (với createdAt ngẫu nhiên trong 30 ngày)!`);
    }
}

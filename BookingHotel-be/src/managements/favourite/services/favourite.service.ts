import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favourite } from '../entities/favourite.entity';
import { User } from '../../../managements/users/entities/users.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Room } from '../../rooms/entities/rooms.entity';

@Injectable()
export class FavouritesService {
    constructor(
        @InjectRepository(Favourite)
        private favouriteRepo: Repository<Favourite>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Hotel)
        private hotelRepo: Repository<Hotel>,
        @InjectRepository(Room)
        private roomRepo: Repository<Room>,
    ) { }

    async findAllByUser(userId: number) {
        return this.favouriteRepo.find({
            where: { user: { id: userId } },
            relations: ['hotel', 'room'],
            order: { createdAt: 'DESC' },
        });
    }

    async create(userId: number, hotelId?: number, roomId?: number) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new NotFoundException('User not found');

        if (!hotelId && !roomId) {
            throw new Error('Favourite must have either a hotelId or roomId');
        }

        const favourite = this.favouriteRepo.create({
            user: { id: userId },
            hotel: hotelId ? { id: hotelId } : null,
            room: roomId ? { id: roomId } : null,
            createdAt: new Date(),
        } as any);

        return this.favouriteRepo.save(favourite);
    }


    async remove(id: number) {
        const favourite = await this.favouriteRepo.findOneBy({ id });
        if (!favourite) throw new NotFoundException('Favourite not found');

        return this.favouriteRepo.remove(favourite);
    }
}

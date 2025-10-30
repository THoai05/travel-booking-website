// ... imports
import { Hotel } from "src/managements/hotels/entities/hotel.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RatePlan } from "./ratePlans.entity";
import { Booking } from "src/managements/bookings/entities/bookings.entity";

export enum RoomTypeName {
    DELUXE_DOUBLE = 'deluxe double',
    DELUXE_FAMILY = 'deluxe family',
    GRAND_FAMILY = 'grand family',
    DELUXE_TRIPLE = 'deluxe triple',
    STANDARD = 'standard',
    DOUBLE_ROOM = 'double room',
    TRIPPLE_ROOM = 'triple room'
}


@Entity()
export class RoomType {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Hotel, (hotel) => hotel.roomTypes)
    @JoinColumn({ name: 'hotel_id' })
    hotel: Hotel
    
    @Column({ name: 'hotel_id' }) // Thêm này để query
    hotelId: number

    @Column({
        type: 'enum',
        enum: RoomTypeName,
        default:RoomTypeName.STANDARD
    })
    name: string // VD: "Phòng 1 Giường Đôi"

    @Column({ type: 'text' })
    description: string

    @Column()
    max_guests: number // VD: 2

    @Column()
    total_inventory: number // VD: Khách sạn có 20 phòng loại này

    @Column({ nullable: true })
    area: string // VD: "25 m²"

    @Column()
    bed_type: string // VD: "1 double bed" (Cái này RẤT QUAN TRỌNG)

    @OneToMany(() => RatePlan, (rateplan) => rateplan.roomType)
    ratePlans: RatePlan[]

    @OneToMany(() => Booking, (booking) => booking.roomType)
    bookings:Booking[]
}   
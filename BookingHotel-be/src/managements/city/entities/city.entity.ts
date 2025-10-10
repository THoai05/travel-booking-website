import { Hotel } from "src/managements/hotels/entities/hotel.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class City{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({
        type: 'nvarchar'
    })
    title: string
    
    @Column({
        type: 'nvarchar',
        nullable:true
    })
    image: string
    
    @Column({
        type: 'nvarchar',
        nullable:true
    })
    description: string
    
    @OneToMany(() => Hotel, (hotels) => hotels.city)
    hotels:Hotel[]
}
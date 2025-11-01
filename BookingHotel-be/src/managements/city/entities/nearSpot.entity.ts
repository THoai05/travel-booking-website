import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { City } from "./city.entity";

@Entity()
export class NearSpot {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    name: string
    
    @Column()
    distance: number
    
    @ManyToOne(() => City, (city) => city.nearSpots,)
    @JoinColumn({name:'cityId'})    
    city: City
}
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { City } from "./city.entity";

@Entity()

export class Region{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    title: string
    
    @OneToMany(() => City, (city) => city.region)
    cities:City[]
}
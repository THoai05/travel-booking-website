import { Hotel } from "src/managements/hotels/entities/hotel.entity";
import { NearSpot } from "./nearSpot.entity";
import { Post } from "src/managements/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Region } from "./region.entity";

@Entity()

export class City {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'nvarchar'
    })
    title: string

    @ManyToOne(() => Region, (region) => region.cities)
    @JoinColumn({
        name:'regionId'
    })
    region:Region

    @Column({
        type: 'nvarchar',
        nullable: true
    })
    image: string

    @Column({
        type: 'nvarchar',
        nullable: true
    })
    description: string

    @OneToMany(() => Hotel, (hotels) => hotels.city)
    hotels: Hotel[]

    @OneToMany(() => NearSpot, (nearSpots) => nearSpots.city)
    nearSpots: NearSpot[]
    @OneToMany(() => Post, (post) => post.city)
    posts: Post[];

    @Column({ default: true })
    isFeatured: boolean;

    @Column({ type: 'float' }) 
    lat: number
     
     @Column({ type: 'float' })
    lon: number
    
    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}
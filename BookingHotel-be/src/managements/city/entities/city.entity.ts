import { Hotel } from "src/managements/hotels/entities/hotel.entity";
import { NearSpot } from "./nearSpot.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "src/managements/posts/entities/post.entity";

@Entity()

export class City {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'nvarchar'
    })
    title: string

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

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
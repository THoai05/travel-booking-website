import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contacts')
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 50 })
    email: string;

    @Column({ length: 1000 })
    message: string;

    @Column({ type: 'timestamp' })
    created_at: Date;
}

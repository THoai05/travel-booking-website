import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('faqs')
export class Faq {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    question: string;

    @Column({ type: 'text' })
    answer: string;

    @Column({ type: 'varchar', length: 100 })
    categories: string;

    @Column({ type: 'varchar', length: 20, default: 'active' })
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}

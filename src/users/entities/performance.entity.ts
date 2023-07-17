import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('performances')
export class PerformanceEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    terminalID: string;

    @Column()
    name: string;

    @Column()
    date: Date;

    @Column()
    inService: number
}
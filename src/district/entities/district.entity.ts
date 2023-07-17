import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,

} from "typeorm";

import { UserEntity } from "../../auth/entities/user.entity";
import { TerminalEntity } from "./terminal.entity";

@Entity('districts')
@Unique(['name'])
export class DistrictEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    name: string;

    @OneToOne(() => UserEntity, userEntity => userEntity.managerDistrict, { eager: false, cascade: true })
    manager: UserEntity;

    @OneToMany(() => UserEntity, userEntity => userEntity.district, { eager: false, cascade: true })
    staffs: UserEntity[];

    @OneToMany(() => TerminalEntity, terminalEntity => terminalEntity.district, { onDelete: 'CASCADE', cascade: true })
    terminals: TerminalEntity[];
}
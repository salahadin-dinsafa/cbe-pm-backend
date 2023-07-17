import {
    BaseEntity, Column,
    Entity, JoinTable, ManyToMany, ManyToOne,
    PrimaryGeneratedColumn, Unique
} from "typeorm";

import { DistrictEntity } from "./district.entity";
import { UserEntity } from "../../auth/entities/user.entity";

@Entity('terminals')
@Unique(['terminalID'])
export class TerminalEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    terminalID: string;

    @Column()
    name: string;

    @ManyToOne(() => DistrictEntity, districtEntity => districtEntity.terminals, { eager: true })
    district: DistrictEntity;

    @ManyToMany(() => UserEntity, userEntity => userEntity.terminals, { eager: true })
    @JoinTable({name: 'operatorsTerminal'})
    operators: UserEntity[];
}
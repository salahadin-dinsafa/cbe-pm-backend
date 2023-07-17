import {
    BaseEntity,
    Column, Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn, Unique
} from "typeorm";

import { ROLES } from "../../common/types/roles.enum";
import { DistrictEntity } from "../../district/entities/district.entity";
import { TerminalEntity } from "../../district/entities/terminal.entity";

@Entity('users')
@Unique(['phoneNumber'])
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    firstName: string;

    @Column({ nullable: true, default: '' })
    lastName: string;

    @Column()
    password: string;

    @Column()
    phoneNumber: string;

    @Column({ type: 'enum', enum: ROLES, default: ROLES.OPERATOR })
    role: ROLES;

    @Column({ nullable: true, default: '' })
    photo: string;

    @OneToOne(() => DistrictEntity, districtEntity => districtEntity.manager)
    @JoinColumn()
    managerDistrict: DistrictEntity;

    @ManyToOne(() => DistrictEntity, districtEntity => districtEntity.staffs)
    @JoinColumn()
    district: DistrictEntity;

    @ManyToMany(() => TerminalEntity, terminalEntity => terminalEntity.operators)
    terminals: TerminalEntity[];

}
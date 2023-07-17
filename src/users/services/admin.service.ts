import {
    BadRequestException,
    ConflictException, ForbiddenException, Injectable,
    NotFoundException,
    UnprocessableEntityException
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { hash } from "bcryptjs";

import { UserEntity } from "../../auth/entities/user.entity";
import { IAddMg } from "../types/add-mg.interface";
import { AuthService } from "../../auth/auth.service";
import { DistrictEntity } from "../../district/entities/district.entity";
import { DistrictService } from "../../district/district.service";
import { ROLES } from "../../common/types/roles.enum";
import { IUpdateMg } from "../types/update-mg.interface";
import { IPhoneNumber } from "../types/phonenumber.interface";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService,
        private readonly districtService: DistrictService,
        private readonly dataSource: DataSource

    ) { }

    async addMg(addMg: IAddMg): Promise<UserEntity> {
        const { firstName, lastName, phoneNumber, districtName } = addMg;
        const modifyedPhone: string = this.authService.modifyPhone(phoneNumber);
        let user: UserEntity = await this.authService.findUserByPhone(modifyedPhone);
        if (user) throw new ConflictException(`User with this phone number already exist`);

        let district: DistrictEntity = await this.districtService.findDistrictByName(districtName);
        if (!district)
            throw new NotFoundException(`District with #name: ${districtName} not found`);

        const hashePassword: string = await hash('Welcome2cbe', 15);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                phoneNumber: modifyedPhone,
                password: hashePassword,
                role: ROLES.DISTRICT_IS_MG,
                managerDistrict: district
            })

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY')
                throw new ConflictException(`This district have already manager`)

            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async updateMg(phoneNumberType: IPhoneNumber, updateMg: IUpdateMg): Promise<UserEntity> {
        const { phoneNumber } = phoneNumberType;
        let modifyedPhone: string = this.authService.modifyPhone(phoneNumber);

        let mg: UserEntity = await this.authService.findUserByPhone(modifyedPhone);
        if (!mg) throw new NotFoundException(`User with #phoneNumber: ${phoneNumber} not found`);
        if (mg.role !== ROLES.DISTRICT_IS_MG)
            throw new ForbiddenException(`can't update this user`)

        let district: DistrictEntity;
        if (updateMg.districtName) {
            district =
                await this.districtService.findDistrictByName(updateMg.districtName);
            if (!district)
                throw new NotFoundException(`District with #districtName: ${updateMg.districtName} not found`);
        }
        updateMg.firstName ? mg.firstName = updateMg.firstName : null
        updateMg.lastName ? mg.lastName = updateMg.lastName : null;
        updateMg.districtName ? mg.managerDistrict = district : null;
        if (updateMg.phoneNumber) {
            let modifyedPhone: string = this.authService.modifyPhone(updateMg.phoneNumber);
            let anotherUser: UserEntity =
                await this.authService.findUserByPhone(modifyedPhone);

            if (anotherUser && anotherUser.id !== mg.id)
                throw new ConflictException(`user with #phoneNumber: ${updateMg.phoneNumber} already exists`);


            mg.phoneNumber = modifyedPhone;
        }

        let queryRunner = this.dataSource.createQueryRunner();
        try {
            if (updateMg.districtName) {
                await queryRunner.startTransaction();
                await queryRunner.manager.save(mg);
                await queryRunner.manager.save(district);

                await queryRunner.commitTransaction();
                return mg;
            }
            return await mg.save();

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new UnprocessableEntityException(`Error: ${error}`)
        } finally {
            await queryRunner.release();
        }
    }

    async removeMg(phoneNumberType: IPhoneNumber): Promise<UserEntity> {
        const { phoneNumber } = phoneNumberType;
        const modifyedPhone: string = this.authService.modifyPhone(phoneNumber);

        let mg: UserEntity = await this.authService.findUserByPhone(modifyedPhone);
        if (!mg)
            throw new NotFoundException(`User with #phoneNumber: ${phoneNumber} not found`);
        if (mg.role !== ROLES.DISTRICT_IS_MG)
            throw new BadRequestException(`can't delete this user`);

        mg.managerDistrict = null;
        try {
            await mg.save();
            return await mg.remove();


        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }


}
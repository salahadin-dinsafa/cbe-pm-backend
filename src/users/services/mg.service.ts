import {
    BadRequestException,
    ConflictException,
    ForbiddenException, Injectable,
    NotFoundException, UnauthorizedException,
    UnprocessableEntityException
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { TwilioService } from "nestjs-twilio";
import { hash } from "bcryptjs";

import { AuthService } from "../../auth/auth.service";
import { UserEntity } from "../../auth/entities/user.entity";
import { IAddStaff } from "../types/add-staff.interface";
import { IPhoneNumber } from "../types/phonenumber.interface";
import { IUpdateMg } from "../types/update-mg.interface";
import { ROLES } from "../../common/types/roles.enum";
import { IToTerminal } from "../types/to-terminal.interface";
import { TerminalEntity } from "../../district/entities/terminal.entity";
import { TerminalService } from "./terminal.service";
import { DistrictEntity } from "../../district/entities/district.entity";
import { PerformanceEntity } from "../entities/performance.entity";


@Injectable()
export class MgService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService,
        private readonly terminalService: TerminalService,
        private readonly dataSource: DataSource
    ) { }
    

    async addStaff(user: UserEntity, addStaff: IAddStaff): Promise<UserEntity> {
        let mgOrIS: UserEntity = await this.authService.findUserByPhone(user.phoneNumber);
        if (!mgOrIS) throw new UnauthorizedException(`user not authorized`);

        const { firstName, lastName, phoneNumber, role } = addStaff;
        if (mgOrIS.role === ROLES.IS) {
            if (role !== ROLES.OPERATOR)
                throw new BadRequestException(`can't add IS staff`)
        }

        const modifiedPhone: string = this.authService.modifyPhone(phoneNumber);
        const hashedPassword: string = await hash('Welcome2cbe', 15);

        let anotherUser: UserEntity =
            await this.authService.findUserByPhone(modifiedPhone);
        if (anotherUser)
            throw new ConflictException(`user with phone number ${phoneNumber} already exists`);

        let district: DistrictEntity =
            mgOrIS.role === ROLES.DISTRICT_IS_MG ? mgOrIS.managerDistrict :
                mgOrIS.district;

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                phoneNumber: modifiedPhone,
                password: hashedPassword,
                role,
                district
            })

        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async updateStaff(user: UserEntity, phoneNumberType: IPhoneNumber, updateStaff: IUpdateMg): Promise<UserEntity> {
        const { phoneNumber } = phoneNumberType;
        let modifyedPhone: string = this.authService.modifyPhone(phoneNumber);

        const mgOrIS: UserEntity = await this.authService.findUserByPhone(
            this.authService.modifyPhone(user.phoneNumber)
        )

        if (!mgOrIS) throw new UnauthorizedException(`user unauthorized`);

        let staff: UserEntity = await this.authService.findUserByPhone(modifyedPhone);
        if (!staff) throw new NotFoundException(`User with #phoneNumber: ${phoneNumber} not found`);

        if (staff.role === ROLES.ADMIN || staff.role === ROLES.DISTRICT_IS_MG)
            throw new ForbiddenException(`can't update this user`)
        let districtName: string =
            mgOrIS.role === ROLES.DISTRICT_IS_MG ? mgOrIS.managerDistrict.name :
                mgOrIS.district.name;

        if (districtName !== staff.district.name)
            throw new ForbiddenException();

        if (mgOrIS.role === ROLES.IS) {
            if (staff.role !== ROLES.OPERATOR)
                throw new BadRequestException(`can't update IS staff`)
        }

        updateStaff.firstName ? staff.firstName = updateStaff.firstName : null
        updateStaff.lastName ? staff.lastName = updateStaff.lastName : null;
        updateStaff.role ? staff.role = updateStaff.role : null;

        if (updateStaff.phoneNumber) {
            let modifyedPhone: string = this.authService.modifyPhone(updateStaff.phoneNumber);
            let anotherUser: UserEntity =
                await this.authService.findUserByPhone(modifyedPhone);

            if (anotherUser && anotherUser.id !== staff.id)
                throw new ConflictException(`user with #phoneNumber: ${updateStaff.phoneNumber} already exists`);


            staff.phoneNumber = modifyedPhone;
        }

        try {
            return await staff.save();

        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async removeStaff(user: UserEntity, phoneNumberType: IPhoneNumber): Promise<UserEntity> {
        const { phoneNumber } = phoneNumberType;
        const modifyedPhone: string = this.authService.modifyPhone(phoneNumber);

        const mgOrIS: UserEntity = await this.authService.findUserByPhone(
            this.authService.modifyPhone(user.phoneNumber)
        )

        if (!mgOrIS) throw new UnauthorizedException(`user unauthorized`);


        let staff: UserEntity = await this.authService.findUserByPhone(modifyedPhone);
        if (!staff)
            throw new NotFoundException(`User with #phoneNumber: ${phoneNumber} not found`);
        if (staff.role === ROLES.ADMIN || staff.role === ROLES.DISTRICT_IS_MG)
            throw new BadRequestException(`can't delete this user`);

        let districtName: string =
            mgOrIS.role === ROLES.DISTRICT_IS_MG ? mgOrIS.managerDistrict.name :
                mgOrIS.district.name;

        if (districtName !== staff.district.name)
            throw new ForbiddenException();

        if (mgOrIS.role === ROLES.IS) {
            if (staff.role !== ROLES.OPERATOR)
                throw new BadRequestException(`can't update IS staff`)
        }

        staff.district = null;
        try {
            await staff.save();
            return await staff.remove();


        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async addOperatorToTerminal(user: UserEntity, toTerminal: IToTerminal): Promise<UserEntity> {
        const mgOrIS: UserEntity = await this.authService.findUserByPhone(
            this.authService.modifyPhone(user.phoneNumber)
        )
        if (!mgOrIS) throw new UnauthorizedException('user not authorized');

        const operator: UserEntity =
            await this.authService.findUserByPhone(
                this.authService.modifyPhone(toTerminal.phoneNumber)
            )

        if (!operator)
            throw new NotFoundException(`Operator with phone number ${toTerminal.phoneNumber} not found`)

        if (operator.role !== ROLES.OPERATOR)
            throw new BadRequestException(`can't assign this user`);
        let districtName: string = mgOrIS.role === ROLES.DISTRICT_IS_MG
            ? mgOrIS.managerDistrict.name : mgOrIS.district.name;

        if (districtName !== operator.district.name)
            throw new BadRequestException(`can't assign other district operators`)

        const terminal: TerminalEntity =
            await this.terminalService.findByTerminalID(toTerminal.terminalID.toUpperCase())
        if (!terminal)
            throw new NotFoundException(`terminal with TerminalID: ${toTerminal.terminalID} not found`)

        if (terminal.district.name !== operator.district.name)
            throw new BadRequestException(`can't assign operators to other terminal district`)
        const isFound: boolean =
            operator.terminals
                .find(inTerminal => inTerminal.name === terminal.name) ? true : false;

        if (isFound) throw new ConflictException('Already assigned');

        try {
            operator.terminals = [...operator.terminals, terminal];
            return await operator.save();

        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }
    async removeOperatorFromTerminal(user: UserEntity, toTerminal: IToTerminal): Promise<UserEntity> {
        const mgOrIS: UserEntity = await this.authService.findUserByPhone(
            this.authService.modifyPhone(user.phoneNumber)
        )
        if (!mgOrIS) throw new UnauthorizedException('user not authorized');

        let operator: UserEntity =
            await this.authService.findUserByPhone(
                this.authService.modifyPhone(toTerminal.phoneNumber)
            )

        if (!operator)
            throw new NotFoundException(`Operator with phone number ${toTerminal.phoneNumber} not found`)

        if (operator.role !== ROLES.OPERATOR)
            throw new BadRequestException(`can't assign this user`);
        const districtName: string = mgOrIS.role === ROLES.DISTRICT_IS_MG
            ? mgOrIS.managerDistrict.name : mgOrIS.district.name;

        if (districtName !== operator.district.name)
            throw new BadRequestException(`can't assign ${toTerminal.phoneNumber} to ${toTerminal.terminalID}`)

        const terminal: TerminalEntity =
            await this.terminalService.findByTerminalID(toTerminal.terminalID.toUpperCase())
        if (!terminal)
            throw new NotFoundException(`terminal with TerminalID: ${toTerminal.terminalID} not found`)

        const isFound: boolean =
            operator.terminals
                .find(inTerminal => inTerminal.name === terminal.name) ? true : false;

        if (!isFound)
            throw new BadRequestException(`Operator not assigned to terminal ${toTerminal.terminalID}`);
        const queryRunnder = this.dataSource.createQueryRunner();
        try {
            await queryRunnder.startTransaction();
            terminal.operators =
                terminal.operators.filter(currentOperator => currentOperator.id !== operator.id);
            operator.terminals =
                operator.terminals.filter(currentTerminal => currentTerminal.id !== terminal.id);
            await queryRunnder.manager.save(terminal);
            operator = await queryRunnder.manager.save(operator);
            await queryRunnder.commitTransaction();
            return operator;

        } catch (error) {
            await queryRunnder.rollbackTransaction();
            throw new UnprocessableEntityException(`Error: ${error}`)
        } finally {
            await queryRunnder.release();
        }
    }

    


    
}
import {
    ConflictException,
    ForbiddenException,
    Injectable, NotFoundException, UnauthorizedException,
    UnprocessableEntityException
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TerminalEntity } from "../../district/entities/terminal.entity";
import { UserEntity } from "../../auth/entities/user.entity";
import { IAddTerminal } from "../types/add-terminal.interface";
import { AuthService } from "../../auth/auth.service";
import { IUpdateTerminal } from "../types/update-terminal.interface";
import { ITerminalID } from "../types/terminal-id.interface";
import { DistrictEntity } from "src/district/entities/district.entity";
import { ROLES } from "src/common/types/roles.enum";
import { IPagination } from "src/district/types/pagination.interface";

@Injectable()
export class TerminalService {
    constructor(
        @InjectRepository(TerminalEntity)
        private readonly terminalRepository: Repository<TerminalEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService
    ) { }

    async findByTerminalID(terminalID: string): Promise<TerminalEntity> {
        try {
            return await this.terminalRepository.findOne({ where: { terminalID }, relations: ['district', 'operators'] })
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async addTerminal(user: UserEntity, addTerminal: IAddTerminal): Promise<TerminalEntity> {
        const modifiedPhone: string = this.authService.modifyPhone(user.phoneNumber);
        const mgOrIS: UserEntity =
            await this.authService.findUserByPhone(modifiedPhone)
        if (!mgOrIS) throw new UnauthorizedException('user not authorized');

        let anotherTerminal: TerminalEntity = await this.findByTerminalID(addTerminal.terminalID);
        if (anotherTerminal)
            throw new ConflictException(`Terminal with terminalID ${addTerminal.terminalID} already exists`);

        let district: DistrictEntity = mgOrIS.role === ROLES.DISTRICT_IS_MG ?
            mgOrIS.managerDistrict : mgOrIS.district;
        try {
            return await this.terminalRepository.save({
                terminalID: addTerminal.terminalID.toUpperCase(),
                name: addTerminal.name.toUpperCase(),
                district
            })
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async updateTerminal(terminalIDType: ITerminalID, user: UserEntity, updateTerminal: IUpdateTerminal)
        : Promise<TerminalEntity> {
        let modifiedPhone: string = this.authService.modifyPhone(user.phoneNumber);

        let terminal: TerminalEntity =
            await this.findByTerminalID(terminalIDType.terminalID.toUpperCase());
        if (!terminal)
            throw new NotFoundException(`terminal with terminalID: ${terminalIDType.terminalID} not found`);
        const mgOrIS: UserEntity =
            await this.authService.findUserByPhone(modifiedPhone);
        if (!mgOrIS) throw new UnauthorizedException('user not authorized');

        let districtName: string = mgOrIS.role === ROLES.DISTRICT_IS_MG
            ? mgOrIS.managerDistrict.name : mgOrIS.district.name;

        if (districtName !== terminal.district.name)
            throw new ForbiddenException(`can't update other district terminal`);

        const { terminalID, name } = updateTerminal;
        if (terminalID) {
            const anotherTerminal: TerminalEntity =
                await this.findByTerminalID(terminalID.toUpperCase());
            if (anotherTerminal && anotherTerminal.terminalID !== terminalIDType.terminalID.toUpperCase())
                throw new ConflictException(`terminal ${terminalID} already exists`)
        }
        terminalID ? terminal.terminalID = terminalID.toUpperCase() : null;
        name ? terminal.name = name.toUpperCase() : null;

        try {
            return await terminal.save();
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`);
        }
    }

    async removeTerminal(terminalIDType: ITerminalID, user: UserEntity): Promise<TerminalEntity> {
        let modifiedPhone: string = this.authService.modifyPhone(user.phoneNumber);

        let terminal: TerminalEntity =
            await this.findByTerminalID(terminalIDType.terminalID.toUpperCase());
        if (!terminal)
            throw new NotFoundException(`terminal with terminalID: ${terminalIDType.terminalID} not found`);
        const mgOrIS: UserEntity =
            await this.authService.findUserByPhone(modifiedPhone);
        if (!mgOrIS) throw new UnauthorizedException('user not authorized');

        let districtName: string = mgOrIS.role === ROLES.DISTRICT_IS_MG
            ? mgOrIS.managerDistrict.name : mgOrIS.district.name;

        if (districtName !== terminal.district.name)
            throw new ForbiddenException(`can't remove others district terminal`);


        try {
            terminal.district = null;
            await terminal.save();
            return await terminal.remove();
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`);
        }
    }

    async findAllTerminals(pagination: IPagination): Promise<TerminalEntity[]> {
        try {
            return await this.terminalRepository.find();
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

}
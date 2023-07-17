import {
    Injectable, UnauthorizedException,
    UnprocessableEntityException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';

import { ILogin } from './interface/login.interface';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) { }

    async findUserById(id: string): Promise<UserEntity> {
        try {
            return await this.userRepository.findOne({ where: { id } });
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async findUserByPhone(phoneNumber: string): Promise<UserEntity> {
        let modifiedPhoneNumber: string = this.modifyPhone(phoneNumber);
        try {
            return await this.userRepository.findOne({ where: { phoneNumber: modifiedPhoneNumber }, relations: ['managerDistrict', 'district', 'terminals'] })
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`);
        }
    }

    async login(login: ILogin): Promise<string> {
        const modifiedPhoneNumber: string = this.modifyPhone(login.phoneNumber);

        let user: UserEntity = await this.findUserByPhone(modifiedPhoneNumber);
        if (!user) throw new UnauthorizedException(`User unauthorized`);

        let hashedPassword: boolean = await compare(login.password, user.password);
        if (!hashedPassword) throw new UnauthorizedException(`User unauthorized`);

        const token: string =
            await this.jwtService.signAsync({ phoneNumber: user.phoneNumber });

        return token;
    }


    modifyPhone(phoneNumber: string): string {
        return phoneNumber.startsWith('+251')
            ? phoneNumber : phoneNumber.startsWith('251')
                ? `+${phoneNumber}` : (phoneNumber.startsWith('09') || phoneNumber.startsWith('07'))
                    ? `+251${phoneNumber.substring(1)}` : (phoneNumber.startsWith('9') || phoneNumber.startsWith('7'))
                        ? `+251${phoneNumber}` : phoneNumber;
    }
}

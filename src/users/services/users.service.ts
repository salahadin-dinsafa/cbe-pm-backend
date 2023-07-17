import {
    BadRequestException,
    ConflictException, Injectable,
    NotFoundException, UnprocessableEntityException
} from '@nestjs/common';

import { DataSource } from 'typeorm';
import { hashSync } from 'bcryptjs';
import { join } from 'path';

import { UserEntity } from '../../auth/entities/user.entity';
import { IUpdateUser } from '../types/update-user.interface';
import { AuthService } from '../../auth/auth.service';
import { isFileExtensionSafe, removeFile } from '../../helpers/image.storage';
import { IPagination } from '../../district/types/pagination.interface';
import { IPhoneNumber } from '../types/phonenumber.interface';

@Injectable()
export class UsersService {
    constructor(
        private readonly authService: AuthService,
        private readonly dataSource: DataSource,
    ) { }



    async updateUser(phoneNumber: string, updateUser: IUpdateUser): Promise<UserEntity> {
        let user: UserEntity = await this.authService.findUserByPhone(phoneNumber);
        if (!user) throw new NotFoundException('user not found');

        updateUser.firstName ?
            user.firstName = updateUser.firstName : null;
        updateUser.lastName ?
            user.lastName = updateUser.lastName : null;

        if (updateUser.phoneNumber) {
            const modifyPhone = this.authService.modifyPhone(updateUser.phoneNumber);
            let anotherUser: UserEntity =
                await this.authService.findUserByPhone(modifyPhone);
            if (anotherUser && user.id === anotherUser.id)
                throw new ConflictException('already have this phone number')
            else if (anotherUser)
                throw new ConflictException(`user already exist with this phone number`)
            else
                user.phoneNumber = updateUser.phoneNumber;
        }

        if (updateUser.password) {
            const hashedPassword: string = hashSync(updateUser.password, 15);
            user.password = hashedPassword;
        }


        try {
            return await user.save();
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async updateImage(id: string, file: Express.Multer.File): Promise<UserEntity> {
        const fileName: string = file?.filename;

        if (!fileName)
            throw new BadRequestException(`File must be a png, jpg/jpeg`);
            
        const imageFolderPath = join(process.cwd(), 'images');
        const fullImagePath = join(imageFolderPath + '/', fileName);
      
        

        const isExtensionSafe: boolean = isFileExtensionSafe(fullImagePath);
        if (!isExtensionSafe) {
            removeFile(fullImagePath);
            throw new BadRequestException(`File content does not match extension`)
        }

        const imagePath: string = fileName;
        let user: UserEntity = await this.authService.findUserById(id);
        if (!user) throw new NotFoundException(`User ${id} does not exist`);

        if (user.photo) {
            const userImagePath: string = join(process.cwd(), 'images', '/', user.photo);
            removeFile(userImagePath);
        }
        try {
            user.photo = imagePath;
            return await user.save();
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async findImage(id: string): Promise<string> {
        let user: UserEntity = await this.authService.findUserById(id);
        if (!user) throw new NotFoundException('user not found');

        if (!user.photo)
            throw new NotFoundException(`User not uploded image yet`)
        try {
            return user.photo;
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async findAll(pagination: IPagination): Promise<UserEntity[]> {
        const { limit, offset, role, districtName } = pagination;

        // Todo: bind district for rest of users
        let queryBuilder = this.dataSource
            .getRepository(UserEntity)
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.managerDistrict', 'managerDistrict');

        limit ?
            queryBuilder.take(limit) : null;
        offset ?
            queryBuilder.skip(offset) : queryBuilder.skip(0);
        role ?
            queryBuilder.andWhere(`users.role= :role`, { role }) : null;
        if (districtName) {
            queryBuilder.andWhere(`managerDistrict.name= :districtName`, { districtName })
        }
        try {
            return await queryBuilder.getMany();
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async find(phoneNumberType: IPhoneNumber): Promise<UserEntity> {
        const modifyPhone: string = this.authService.modifyPhone(phoneNumberType.phoneNumber);
        let user: UserEntity = await this.authService.findUserByPhone(modifyPhone);
        if (!user) throw new NotFoundException(`User not found`);

        return user;
    }

    async findProfile(user: UserEntity): Promise<UserEntity> {

        const phoneNumber: IPhoneNumber = {
            phoneNumber: user.phoneNumber
        }
        let profile: UserEntity = await this.find(phoneNumber);
        try {
            return profile;
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }
}

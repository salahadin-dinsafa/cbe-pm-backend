import {
    Body, Controller, Patch, Post,
    UploadedFile, Get,
    UseGuards, UseInterceptors, Res, Param, Query, ParseFilePipe, FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { AuthGuard } from '@nestjs/passport';

import { UsersService } from '../services/users.service';
import { UserEntity } from '../../auth/entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';
import { UpdateUserDto } from '../dto/update-user.dto';
import { saveImageToStorage } from '../../helpers/image.storage';
import { UserPagination } from '../dto/user-pagination.type';
import { PhoneNumberDto } from '../dto/phonenumber.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    /**
     * update own profile
     */
    @UseGuards(AuthGuard('jwt'))
    @Patch('profile')
    updateUser(
        @Body() updateUserDto: UpdateUserDto,
        @User('phoneNumber') phoneNumber: string): Promise<UserEntity> {
        return this.userService.updateUser(phoneNumber, updateUserDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadImage(
        @User('id') id: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<UserEntity> {
        return this.userService.updateImage(id, file)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('image')
    async findImage(
        @User('id') id: string,
        @Res() res: Response
    ): Promise<any> {
        const imagePath: string = await this.userService.findImage(id);
        return res.sendFile(imagePath, { root: './images' })
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Query() pagination: UserPagination): Promise<UserEntity[]> {
        return this.userService.findAll(pagination);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    findProfile(@User() user: UserEntity): Promise<UserEntity> {
        return this.userService.findProfile(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':phoneNumber')
    find(@Param() phoneNumberDto: PhoneNumberDto): Promise<UserEntity> {
        return this.userService.find(phoneNumberDto);
    }


}

import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioModule } from 'nestjs-twilio';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserEntity } from '../auth/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './controllers/admin.controllers';
import { AdminService } from './services/admin.service';
import { DistrictModule } from '../district/district.module';
import { MgController } from './controllers/mg.controller';
import { MgService } from './services/mg.service';
import { TerminalEntity } from '../district/entities/terminal.entity';
import { TerminalController } from './controllers/terminal.controllers';
import { TerminalService } from './services/terminal.service';
import { PerformanceEntity } from './entities/performance.entity';
import { PerformanceService } from './services/performance.service';
import {PerformanceController} from './controllers/performance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TerminalEntity, PerformanceEntity]),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
        authToken: cfg.get('TWILIO_AUTH_TOKEN')
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    DistrictModule
  ],
  controllers: [
    UsersController,
    AdminController,
    MgController,
    TerminalController,
  PerformanceController],
  providers: [
    UsersService,
    AdminService,
    MgService,
    TerminalService,
    PerformanceService]
})
export class UsersModule { }

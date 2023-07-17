import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ormConfig } from './common/db/ormconfig.datasource';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DistrictModule } from './district/district.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.required().default('localhost'),
        DB_USER: Joi.required(),
        DB_PASSWORD: Joi.required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.required().default(3306),
        JWT_SECRET: Joi.required(),
        TWILIO_ACCOUNT_SID: Joi.required(),
        TWILIO_AUTH_TOKEN: Joi.required(),
        TWILIO_PHONENUMBER: Joi.required()
      })
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig
    }),
    AuthModule,
    UsersModule,
    DistrictModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true }
      })
    }
  ]
})
export class AppModule { }

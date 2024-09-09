import { Module, Injectable } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { PxeModule } from './pxe/pxe.module.js';
import { AppService } from './app.service.js';
import { WalletController } from './wallet/wallet.controller.js';
import { WalletService } from './wallet/wallet.service.js';
import { UsersService } from './users/users.service.js';
import { UsersModule } from './users/users.module.js';
import { User } from './users/user.entity.js';


@Module({
  imports: [ConfigModule.forRoot(), PxeModule, TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('DATABASE_HOST'),
      port: +configService.get('DATABASE_PORT'),
      username: configService.get('DATABASE_USERNAME'),
      password: configService.get('DATABASE_PASSWORD'),
      database: configService.get('DATABASE_NAME'),
      entities: [User],
      synchronize: true,
    }),
    inject: [ConfigService],
  }), UsersModule],
  controllers: [AppController, WalletController],
  providers: [ConfigService, AppService, WalletService, UsersService],
})

export class AppModule {}





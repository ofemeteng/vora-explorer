import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';
import { Passkey } from './passkey.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Passkey])],
  providers: [UsersService],
  controllers: [],
  exports: [TypeOrmModule]
})
export class UsersModule {}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(username: string, address: string, signingKey: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.address = address;
    user.signingKey = signingKey;

    return await this.usersRepository.save(user);
  }

  async updateUser(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

}
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Passkey } from './user.entity.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Passkey)
        private passkeyRepository: Repository<Passkey>,
    ) { }

    async create(username: string): Promise<User> {
        const existingUser = await this.usersRepository.findOne({ where: { username: username } });
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        const user = new User();
        user.username = username;

        return await this.usersRepository.save(user);

    }

    async updateUserAddressDetails(username: string, address: string, signingKey: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { username: username } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.address = address;
        user.signingKey = signingKey;
        return await this.usersRepository.save(user);
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { username: username } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async setCurrentOptions(username: string, options: any): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { username: username } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.currentOptions = options;
        await this.usersRepository.save(user);
    }

    async getCurrentOptions(username: string): Promise<any | null> {
        const user = await this.usersRepository.findOne({ where: { username: username } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user?.currentOptions || null;
    }

    async clearCurrentOptions(username: string): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { username: username } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.currentOptions = null;
        await this.usersRepository.save(user);
    }

    async getPasskeysByUsername(username: string): Promise<Passkey[]> {
        const user = await this.usersRepository.findOne({ where: { username: username } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.passkeyRepository.find({
            where: { username },
            order: {
                createdAt: 'DESC'
            }
        });
    }

    async getPasskeyByCredentialID(username: string, credentialID: string): Promise<Passkey> {
        const user = await this.usersRepository.findOne({ where: { username: username } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const passkey = await this.passkeyRepository.findOne({ where: { id: credentialID } });
        if (!passkey) {
            throw new NotFoundException('Passkey not found');
        }

        return passkey;
    }

    async createPasskey(registrationInfo, transports, user: User): Promise<Passkey> {
        const isUser = await this.usersRepository.findOne({ where: { username: user.username } });
        if (!isUser) {
            throw new NotFoundException('User not found');
        }

        const passkey = new Passkey();

        const {
            credentialID,
            credentialPublicKey,
            counter,
            credentialDeviceType,
            credentialBackedUp,
        } = registrationInfo;

        passkey.id = credentialID;
        passkey.username = user.username;
        passkey.webauthnUserID = user.currentOptions.user.id;
        passkey.publicKey = credentialPublicKey;
        passkey.counter = counter
        passkey.deviceType = credentialDeviceType
        passkey.backedUp = credentialBackedUp
        passkey.transports = transports

        return await this.passkeyRepository.save(passkey);
    }

    async updatePasskey(newCounter, username: string, credentialID: string): Promise<void> {
        const passkey = await this.passkeyRepository.findOne({ where: { id: credentialID } });
        if (!passkey) {
            throw new NotFoundException('Passkey not found');
        }

        if (username != passkey.username) {
            throw new ForbiddenException('Cannot modify a passkey that belongs to another user');
        }

        passkey.counter = newCounter;
        await this.passkeyRepository.save(passkey);
    }

}
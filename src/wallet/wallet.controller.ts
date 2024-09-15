import { Controller, Get, Post, Body, Req, Res, Render } from '@nestjs/common';
import { Request, Response } from 'express';
import {
    generateAuthenticationOptions,
    generateRegistrationOptions,
    verifyAuthenticationResponse,
    verifyRegistrationResponse,
  } from '@simplewebauthn/server';
import type { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types';
import { ConfigService } from '@nestjs/config';
import { WalletService } from './wallet.service.js';
import { UsersService } from '../users/users.service.js';
import { Passkey } from '../users/passkey.entity.js';
import { SendDto } from './dto/send.dto.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';

@Controller()
export class WalletController {
    private readonly rpName: string;
    private readonly rpID: string;
    private readonly origin: string;

    constructor(private readonly walletService: WalletService, private readonly usersService: UsersService, private readonly configService: ConfigService) {
        this.rpName = this.configService.get<string>('RP_NAME');
        this.rpID = this.configService.get<string>('RP_ID');
        this.origin = this.configService.get<string>('ORIGIN');
    }

    @Get('login')
    @Render('login')
    login() {
        return { title: 'Vora Wallet - Login with Passkey' };
    }

    @Get('create-wallet')
    @Render('create-wallet')
    getCreateWallet() {
        return { title: 'Vora Wallet - Create Wallet' }
    }

    @Get('home')
    @Render('home')
    getHome() {
        return { title: 'Vora Wallet - Dashboard' }
    }


    @Get('mint-eth-public')
    async mintETHPublic() {
        const contract_address = this.walletService.getDeployedETHTokenContractAddress();
        if (contract_address) {
            const amount = 100;
            const recipient = ''
            const txDetails = await this.walletService.mintETHPublic(amount, recipient);
            return { message: 'ETH minted successfully', txDetails: txDetails }
        } else {
            return { message: 'Failed to deploy ETH Token', address: null }
        }
    }

    @Post('create-username-wallet')
    @Render('home')
    async createWallet(@Body() createUserDto: CreateUserDto) {
        const aztecAccount = await this.walletService.createAztecAccount();
        if (aztecAccount) {
            const address = aztecAccount.address;
            const signingKey = aztecAccount.signingKey;
            const username = createUserDto.username;
            await this.usersService.create(username, address, signingKey);

            return { title: 'Vora Wallet - Dashboard', username: username, address: address }
        } else {
            return { title: 'Vora Wallet - Dashboard', username: null, address: null }
        }
    }

    @Get('send')
    @Render('send')
    getSend() {
        return { title: 'Vora Wallet - Send' };
    }

    // @Post('send-funds')
    // async send(@Body() sendDto: SendDto) {
    //     return this.walletService.sendPublic(sendDto);
    // }

    @Get('receive')
    @Render('receive')
    getReceive() {
        // const address = this.walletService.getAddress();
        return { title: 'Vora Wallet - Receive' };
    }

}
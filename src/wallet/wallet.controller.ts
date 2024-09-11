import { Controller, Get, Post, Body, Req, Res, Render } from '@nestjs/common';
import { Request, Response } from 'express';
import { WalletService } from './wallet.service.js';
import { UsersService } from '../users/users.service.js';
import { SendDto } from './dto/send.dto.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';

@Controller()
export class WalletController {
    constructor(private readonly walletService: WalletService, private readonly usersService: UsersService) { }

    @Get()
    @Render('login')
    getRoot() {
        return {};
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

    // @Get('deploy-eth')
    // async deployETHToken() {
    //     const contract_address =  await this.walletService.deployETHToken();
    //     if (contract_address) {
    //         return  { message: 'ETH Deployed successfully', address: contract_address }
    //     } else {
    //         return  { message: 'Failed to deploy ETH Token', address: null }
    //     }

    // }

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

    @Post('send-funds')
    async send(@Body() sendDto: SendDto) {
        return this.walletService.sendPublic(sendDto);
    }

    @Get('receive')
    @Render('receive')
    getReceive() {
        // const address = this.walletService.getAddress();
        return { title: 'Vora Wallet - Receive' };
    }

}
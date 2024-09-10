import { Controller, Get, Post, Body, Req, Res, Render } from '@nestjs/common';
import { Request, Response } from 'express';
import { WalletService } from './wallet.service.js';
import { UsersService } from '../users/users.service.js';
import { SendDto } from './dto/send.dto.js'; // Add this import
import { CreateUserDto } from '../users/dto/create-user.dto.js';

@Controller()
export class WalletController {
    constructor(private readonly walletService: WalletService, private readonly usersService: UsersService) { }

    @Get()
    @Render('login')
    getRoot() {
        return {};
    }

    @Get('wallet/login')
    @Render('login')
    getLogin() {
        return {};
    }

    @Get('create-wallet')
    @Render('create-wallet')
    getCreateWallet() {
        return  { title: 'Vora Wallet - Create Wallet' }
    }

    @Get('home')
    @Render('home')
    getHome() {
        return  { title: 'Vora Wallet - Dashboard' }
    }

    @Post('create-username-wallet')
    @Render('home')
    async createWallet(@Body() createUserDto: CreateUserDto) {
        const user =  await this.usersService.create(createUserDto);
        const username = user.username;
        return  { title: 'Vora Wallet - Dashboard', username: username }
    }

    // @Get('create-wallet')
    // getCreateWallet(@Res() res: Response) {
    //     const htmlString = this.walletService.createWallet(res);
    //     return res.send(htmlString);
    // }

    @Get('wallet/import-wallet')
    @Render('import-wallet')
    getImportWallet() {
        return {};
    }

    @Get('wallet/dashboard')
    @Render('dashboard')
    async getDashboard() {
        const balance = await this.walletService.getBalance();
        const address = await this.walletService.getAddress();
        const transactions = await this.walletService.getTransactions();
        return { balance, address, transactions };
    }

    @Get('send')
    @Render('send')
    getSend() {
        return  { title: 'Vora Wallet - Send' };
    }

    @Get('receive')
    @Render('receive')
    getReceive() {
        const address = this.walletService.getAddress();
        return  { title: 'Vora Wallet - Receive', address: address};
    }

    @Get('wallet/transactions')
    @Render('transactions')
    async getTransactions() {
        const transactions = await this.walletService.getTransactions();
        return { transactions };
    }

    @Get('wallet/explore')
    @Render('explore')
    getExplore() {
        return {};
    }


    @Post('wallet/import')
    async importWallet(@Body('privateKey') privateKey: string) {
        return this.walletService.importWallet(privateKey);
    }

    @Post('wallet/send')
    async send(@Body() sendDto: SendDto) {
        return this.walletService.send(sendDto);
    }
}
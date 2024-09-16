import { Controller, Get, Post, Body, Req, Res, Render, Session, BadRequestException, NotFoundException } from '@nestjs/common';
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
import { SendDto } from './dto/send.dto.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { Passkey } from 'src/users/user.entity.js';

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
        return { title: 'Vora Wallet - Login with Username and Passkey' };
    }

    @Get('create-wallet')
    @Render('create-wallet')
    getCreateWallet() {
        return { title: 'Vora Wallet - Create Wallet' }
    }

    @Get('home')
    @Render('home')
    async getHome(@Session() session: Record<string, any>) {
        const username = session.username ? session.username : '';

        const user = await this.usersService.findByUsername(username);

        const ETHTokenContractAddress = await this.walletService.getDeployedETHTokenContractAddress()

        if (!ETHTokenContractAddress) {
            return { title: 'Vora Wallet - Dashboard', username: user.username, address: user.address, public_eth_balance: 'NA' }
        }

        const ETHTokenContractAddressString = ETHTokenContractAddress.toString()

        const balanceDetails = await this.walletService.getUserPublicTokenBalance(user.address, user.signingKey, ETHTokenContractAddressString)

        return { title: 'Vora Wallet - Dashboard', username: user.username, address: user.address, public_eth_balance: balanceDetails.balance }
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

    @Post('generate-registration-options')
    async generateRegistrationOptions(@Body() createUserDto: CreateUserDto, @Session() session: Record<string, any>) {
        const username = createUserDto.username;
        if (username == '') {
            throw new BadRequestException('Username cannot be empty');
        }
        const user = await this.usersService.create(username);

        const userPasskeys: Passkey[] = await this.usersService.getPasskeysByUsername(user.username);

        const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions({
            rpName: this.rpName,
            rpID: this.rpID,
            userName: user.username,
            attestationType: 'none',
            excludeCredentials: userPasskeys.map(passkey => ({
                id: passkey.id,
                // Optional
                transports: passkey.transports,
            })),
            authenticatorSelection: {
                // Defaults
                residentKey: 'preferred',
                userVerification: 'preferred',
                // Optional
                authenticatorAttachment: 'cross-platform',
            },
        });

        await this.usersService.setCurrentOptions(user.username, options);

        session.username = user.username;

        return options;
    }

    @Post('/generate-authentication-options')
    async generateAuthenticationOptions(@Body() createUserDto: CreateUserDto, @Session() session: Record<string, any>) {
        const username = createUserDto.username;
        if (username == '') {
            throw new BadRequestException('Username cannot be empty');
        }
        const user = await this.usersService.findByUsername(username);
        const userPasskeys: Passkey[] = await this.usersService.getPasskeysByUsername(user.username);

        const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
            rpID: this.rpID,
            // Require users to use a previously-registered authenticator
            allowCredentials: userPasskeys.map(passkey => ({
                id: passkey.id,
                transports: passkey.transports,
            })),
        });

        await this.usersService.setCurrentOptions(user.username, options);

        session.username = user.username;

        return options;
    }

    @Post('/verify-registration')
    async verifyRegistration(@Body() body, @Session() session: Record<string, any>) {
        const username = session.username ? session.username : '';
        const user = await this.usersService.findByUsername(username);
        const currentOptions: PublicKeyCredentialCreationOptionsJSON = await this.usersService.getCurrentOptions(user.username);

        let verification;
        try {
            verification = await verifyRegistrationResponse({
                response: body,
                expectedChallenge: currentOptions.challenge,
                expectedOrigin: this.origin,
                expectedRPID: this.rpID,
            });
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }

        if (verification.verified) {
            const { registrationInfo } = verification;
            const transports = body.response.transports
            await this.usersService.createPasskey(registrationInfo, transports, user);

        }

        const aztecAccount = await this.walletService.createAztecAccount();
        if (aztecAccount) {
            const address = aztecAccount.address;
            const signingKey = aztecAccount.signingKey;
            await this.usersService.updateUserAddressDetails(username, address, signingKey);
        }

        return verification

    }

    @Post('/verify-authentication')
    async verifyAuthentication(@Body() body, @Session() session: Record<string, any>) {
        const username = session.username ? session.username : '';
        const user = await this.usersService.findByUsername(username);
        const passkey = await this.usersService.getPasskeyByCredentialID(username, body.id);

        let verification;
        try {
            verification = await verifyAuthenticationResponse({
                response: body,
                expectedChallenge: user.currentOptions.challenge,
                expectedOrigin: this.origin,
                expectedRPID: this.rpID,
                authenticator: {
                    credentialID: passkey.id,
                    credentialPublicKey: passkey.publicKey,
                    counter: passkey.counter,
                    transports: passkey.transports,
                },
            });
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }

        if (verification.verified) {
            const { authenticationInfo } = verification;
            const { newCounter } = authenticationInfo;
            await this.usersService.updatePasskey(newCounter, user.username, passkey.id);
        }

        return verification;
    }

    @Get('send')
    @Render('send')
    async getSend(@Session() session: Record<string, any>) {
        const username = session.username ? session.username : '';

        const user = await this.usersService.findByUsername(username);

        return { title: 'Vora Wallet - Send', address: user.address };
    }

    @Post('send-funds')
    @Render('status')
    async sendPublic(@Body() sendDto: SendDto, @Session() session: Record<string, any>) {
        const username = session.username ? session.username : '';

        const user = await this.usersService.findByUsername(username);

        const recipient = sendDto.recipient;
        const amount = sendDto.amount;

        const truncatedRrecipient = recipient.length <= 10 ? recipient : recipient.slice(0, 5) + '...' + recipient.slice(-5);

        const ETHTokenContractAddress = await this.walletService.getDeployedETHTokenContractAddress()

        if (!ETHTokenContractAddress) {
            return { title: 'Vora Wallet - Status', message: 'Transaction Failed', amount: amount, recipient: truncatedRrecipient, txHash: 'NA', svg_class: 'text-red-500', svg_path: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
        }

        const ETHTokenContractAddressString = ETHTokenContractAddress.toString()

        const txDetails = await this.walletService.sendPublic(user.address, recipient, user.signingKey, amount, ETHTokenContractAddressString)

        if (txDetails) {
            return { title: 'Vora Wallet - Status', message: 'Transaction Successful', amount: amount, recipient: truncatedRrecipient, txHash: txDetails.txHash, svg_class: 'text-green-500', svg_path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
        } else {
            return { title: 'Vora Wallet - Status', message: 'Transaction Failed', amount: amount, recipient: truncatedRrecipient, txHash: 'NA', svg_class: 'text-red-500', svg_path: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
        }
    }

    @Get('receive')
    @Render('receive')
    async getReceive(@Session() session: Record<string, any>) {
        const username = session.username ? session.username : '';

        const user = await this.usersService.findByUsername(username);

        return { title: 'Vora Wallet - Receive', address: user.address };
    }

}
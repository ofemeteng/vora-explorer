import { Req, Res, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { getDeployedTestAccountsWallets } from "@aztec/accounts/testing";
import { Fr, GrumpkinScalar } from '@aztec/aztec.js';
import { TokenContract, TokenContractArtifact } from '@aztec/noir-contracts.js/Token';
import { SendDto } from './dto/send.dto.js';
import { PxeService } from '../pxe/pxe.service.js';

@Injectable()
export class WalletService {
    private readonly logger = new Logger(WalletService.name);

    constructor(private pxeService: PxeService) {}

    async createAztecAccount() {
        try {
            const pxe = this.pxeService.getPxe();
            const secretKey = Fr.random();
            const signingPrivateKey = GrumpkinScalar.random();
            const wallet = await getSchnorrAccount(pxe, secretKey, signingPrivateKey).waitSetup();
            
            let walletDetails = {
                address: wallet.getAddress().toString(),
                signingKey: signingPrivateKey.toString(),
            };
        
            return walletDetails;
        } catch(error) {
            return null;
        }
    }

    async deployETHToken() {
        try {
            const pxe = this.pxeService.getPxe();

            const accounts = await getDeployedTestAccountsWallets(pxe);

            const adminWallet = accounts[0];
            const adminAddress = adminWallet.getAddress();

            const deployedContract = await TokenContract.deploy(
                adminWallet,
                adminAddress,
                'Ethereum',
                'ETH',
                18,
              ).send().deployed();

            return deployedContract.address;

        } catch(error) {
            this.logger.error('Failed to deploy ETH Token', error);
            return null;
        }
    }

    send(sendDto: SendDto) {
        // Logic to send funds
        return { message: 'Funds sent successfully' };
    }

    getBalance() {
        // Logic to get wallet balance
        return 100; // Example balance
    }

    getAddress() {
        // Logic to get wallet address
        return '0xYourWalletAddress'; // Example address
    }

    getTransactions() {
        // Logic to get wallet transactions
        return [
            { id: 1, amount: 50, type: 'sent' },
            { id: 2, amount: 20, type: 'received' },
        ]; // Example transactions
    }
}
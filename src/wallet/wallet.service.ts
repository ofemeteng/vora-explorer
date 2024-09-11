import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { getDeployedTestAccountsWallets } from "@aztec/accounts/testing";
import { Fr, GrumpkinScalar } from '@aztec/aztec.js';
import { TokenContract, TokenContractArtifact } from '@aztec/noir-contracts.js/Token';
import { SendDto } from './dto/send.dto.js';
import { PxeService } from '../pxe/pxe.service.js';
import { AztecAddress, PXE, Wallet } from '@aztec/aztec.js';

@Injectable()
export class WalletService implements OnModuleInit {
    private readonly logger = new Logger(WalletService.name);
    private pxe: PXE;
    private adminWallet: Wallet;
    private adminAddress: AztecAddress;
    private deployedETHTokenContractAddress: AztecAddress;

    constructor(private pxeService: PxeService) {}

    async onModuleInit() {
        await this.initialize();
    }

    private async initialize() {
        try {
            this.pxe = this.pxeService.getPxe();
            const accounts = await getDeployedTestAccountsWallets(this.pxe);
            this.adminWallet = accounts[0];
            this.adminAddress = this.adminWallet.getAddress();
            await this.deployETHToken();
        } catch (error) {
            this.logger.error('Failed to initialize WalletService', error);
        }
    }

    async createAztecAccount() {
        try {
            const secretKey = Fr.random();
            const signingPrivateKey = GrumpkinScalar.random();
            const wallet = await getSchnorrAccount(this.pxe, secretKey, signingPrivateKey).waitSetup();
            
            let walletDetails = {
                address: wallet.getAddress().toString(),
                signingKey: signingPrivateKey.toString(),
            };
        
            return walletDetails;
        } catch(error) {
            this.logger.error('Failed to create Aztec account', error);
            return null;
        }
    }

    private async deployETHToken() {
        try {
            const deployedETHTokenContract = await TokenContract.deploy(
                this.adminWallet,
                this.adminAddress,
                'Ethereum',
                'ETH',
                18
            ).send().deployed();
            this.deployedETHTokenContractAddress = deployedETHTokenContract.address;

            this.logger.log(`ETH Token deployed at ${this.deployedETHTokenContractAddress}`);
        } catch(error) {
            this.logger.error('Failed to deploy ETH Token', error);
        }
    }

    async mintETHPublic(amount: bigint, recipient: string) {
        try {
            if (!this.deployedETHTokenContractAddress) {
                throw new Error('ETH Token contract not deployed');
            }

            const contract = await TokenContract.at(this.deployedETHTokenContractAddress, TokenContractArtifact, this.adminWallet);
            const address = AztecAddress.fromString(recipient);

            const _tx = await contract.methods.mint_public(address, amount).send().wait();
            this.logger.log(`Minted ${amount} ETH to ${address}`);

            const txDetails = {
                tx: _tx.txHash,
                recipient: AztecAddress.toString(address),
                amount: amount
            };
            return txDetails;
        } catch(error) {
            this.logger.error('Failed to mint ETH Token', error);
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
        return this.adminAddress.toString();
    }

    getTransactions() {
        // Logic to get wallet transactions
        return [
            { id: 1, amount: 50, type: 'sent' },
            { id: 2, amount: 20, type: 'received' },
        ]; // Example transactions
    }
}
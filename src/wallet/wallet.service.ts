import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { getSchnorrAccount, getSchnorrWallet } from '@aztec/accounts/schnorr';
import { getDeployedTestAccountsWallets } from "@aztec/accounts/testing";
import { Fr, GrumpkinScalar } from '@aztec/aztec.js';
import { TokenContract, TokenContractArtifact } from '@aztec/noir-contracts.js/Token';
import { SendDto } from './dto/send.dto.js';
import { PxeService } from '../pxe/pxe.service.js';
import { AztecAddress, Wallet, PXE } from '@aztec/aztec.js';

@Injectable()
export class WalletService implements OnModuleInit {
    private readonly logger = new Logger(WalletService.name);
    private pxe: PXE;
    private adminWallet: Wallet;
    private adminAddress: AztecAddress;
    private deployedETHTokenContractAddress: AztecAddress;

    constructor(private pxeService: PxeService) { }

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

            const walletDetails = {
                address: wallet.getAddress().toString(),
                signingKey: signingPrivateKey.toString(),
            };

            return walletDetails;
        } catch (error) {
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
        } catch (error) {
            this.logger.error('Failed to deploy ETH Token', error);
        }
    }

    async mintETHPublic(amount: number, recipient: string) {
        try {
            if (!this.deployedETHTokenContractAddress) {
                throw new Error('ETH Token contract not deployed');
            }

            const contract = await TokenContract.at(this.deployedETHTokenContractAddress, this.adminWallet);
            const address = AztecAddress.fromString(recipient);

            const _tx = await contract.methods.mint_public(address, amount).send().wait();
            this.logger.log(`Minted ${amount} ETH to ${address}`);

            const txDetails = {
                tx: _tx.txHash,
                recipient: address,
                amount: amount
            };
            return txDetails;
        } catch (error) {
            this.logger.error('Failed to mint ETH Token', error);
            return null;
        }
    }

    async sendPublic(from_address: string, to_address: string, signingKey: string, amount: bigint, token_address: string): Promise<bigint> {
        try {
            if (!this.deployedETHTokenContractAddress) {
                throw new Error('ETH Token contract not deployed');
            }

            const _from_address = AztecAddress.fromString(from_address);
            const _to_address = AztecAddress.fromString(to_address);
            const _token_address = AztecAddress.fromString(token_address) || this.deployedETHTokenContractAddress;

            const userWallet = await getSchnorrWallet(
                this.pxe,
                _from_address,
                GrumpkinScalar.fromString(signingKey),
            );

            const contract = await TokenContract.at(_token_address, userWallet);

            const _tx = await contract.methods.transfer_public(_from_address, _token_address, amount, 0).send().wait();

            const txDetails = {
                tx: _tx.txHash,
                from_address: _from_address,
                to_address: _to_address,
                amount: amount,
                token_address: token_address
            };
        } catch (error) {
            this.logger.error('Failed to send the tokens', error);
            return null;
        }
    }

    async getUserPublicTokenBalance(user_address: string, signingKey: string, token_address: string) {
        try {
            if (!this.deployedETHTokenContractAddress) {
                throw new Error('ETH Token contract not deployed');
            }

            const _user_address = AztecAddress.fromString(user_address);
            const _token_address = AztecAddress.fromString(token_address) || this.deployedETHTokenContractAddress;

            const userWallet = await getSchnorrWallet(
                this.pxe,
                _user_address,
                GrumpkinScalar.fromString(signingKey),
            );

            const contract = await TokenContract.at(_token_address, userWallet);

            const balance = await contract.methods.balance_of_public(_user_address).simulate();

            this.logger.log(`Public Balance of ${_user_address}: ${balance}`);

            const balanceDetails = {
                user_address: _user_address,
                token_address: _token_address,
                balance: balance
            };

            return balanceDetails;
        } catch (error) {
            this.logger.error(`Failed to get public token balance for ${user_address}`, error);
            throw error;
        }
    }

    async getUserPrivateTokenBalance(user_address: string, signingKey: string, token_address: string) {
        try {
            if (!this.deployedETHTokenContractAddress) {
                throw new Error('ETH Token contract not deployed');
            }

            const _user_address = AztecAddress.fromString(user_address);
            const _token_address = AztecAddress.fromString(token_address) || this.deployedETHTokenContractAddress;

            const userWallet = await getSchnorrWallet(
                this.pxe,
                _user_address,
                GrumpkinScalar.fromString(signingKey),
            );

            const contract = await TokenContract.at(_token_address, userWallet);

            const balance = await contract.methods.balance_of_private(_user_address).simulate();

            this.logger.log(`Private Balance of ${_user_address}: ${balance}`);

            const balanceDetails = {
                user_address: _user_address,
                token_address: _token_address,
                balance: balance
            };

            return balanceDetails;
        } catch (error) {
            this.logger.error(`Failed to get private token balance for ${user_address}`, error);
            throw error;
        }
    }

    getAdminAddress() {
        try {
            return this.adminAddress.toString();
        } catch (error) {
            return { message: 'Admin wallet is not set' };
        }

    }

    getDeployedETHTokenContractAddress() {
        try {
            return this.deployedETHTokenContractAddress;
            // return '';
        } catch (error) {
            return { message: 'ETH Token Contract is not deployed' };
        }

    }

}
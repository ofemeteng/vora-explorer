import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block, Transaction, Contract } from './indexer.entity.js';


@Injectable()
export class DataService {
    constructor(
        @InjectRepository(Block)
        private blockRepository: Repository<Block>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        @InjectRepository(Contract)
        private contractRepository: Repository<Contract>,
    ) { }

    async saveBlock(blockData: Partial<Block>): Promise<Block> {
        const block = this.blockRepository.create(blockData);
        return this.blockRepository.save(block);
    }

    async saveTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
        const transaction = this.transactionRepository.create(transactionData);
        return this.transactionRepository.save(transaction);
    }

    async saveContract(contractData: Partial<Contract>): Promise<Contract> {
        const contract = this.contractRepository.create(contractData);
        return this.contractRepository.save(contract);
    }

    async getBlockByNumber(blockNumber: number): Promise<Block> {
        return this.blockRepository.findOne({ where: { blockNumber: blockNumber } });
    }

    async getTransactionByTxHash(txHash: string): Promise<Transaction> {
        return this.transactionRepository.findOne({ where: { txHash: txHash } });
    }

    async getContractByAddress(address: string): Promise<Contract> {
        return this.contractRepository.findOne({ where: { address: address } });
    }

    async getBlocks(skip: number, take: number): Promise<[Block[], number]> {
        return this.blockRepository.findAndCount({
            order: { blockNumber: 'DESC' },
            skip,
            take,
        });
    }

    async getTransactions(skip: number, take: number): Promise<[Transaction[], number]> {
        return this.transactionRepository.findAndCount({
            order: { timestamp: 'DESC' },
            skip,
            take,
        });
    }

    async getContracts(skip: number, take: number): Promise<[Contract[], number]> {
        return this.contractRepository.findAndCount({
            order: { timestamp: 'DESC' },
            skip,
            take,
        });
    }
}
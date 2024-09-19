import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { AztecAddress, PXE, TxHash } from '@aztec/aztec.js';
import { NoteStatus } from '@aztec/circuit-types';
import { PxeService } from '../pxe/pxe.service.js';

@Injectable()
export class IndexerService implements OnModuleInit {
  private readonly logger = new Logger(IndexerService.name);
  private pxe: PXE;

  constructor(private pxeService: PxeService) { }

  async onModuleInit() {
    await this.initialize();
  }

  private async initialize() {
    try {
      this.pxe = this.pxeService.getPxe();

      this.pxe.getBlock(1)
    } catch (error) {
      this.logger.error('Failed to initialize IndexerService', error);
    }
  }

  // Fetches the current block number.
  async getCurrentBlockNumber(): Promise<number> {
    const currentBlockNumber = await this.pxe.getBlockNumber();
    if (!currentBlockNumber) {
      throw new NotFoundException('Cannot find current block number');
    }

    return currentBlockNumber
  }

  // Get the given block.
  async getBlockByNumber(blockNumber: number) {
    console.log('Number passed in: ', blockNumber);
    const block = await this.pxe.getBlock(blockNumber);
    console.log('getBlockByNumber Return Value:', block);
    if (!block) {
      throw new NotFoundException('Block not found');
    }

    return block;
  }

  async getBlocks(fromBlock: number, toBlock: number) {

  }

  // Returns a transaction receipt for a given transaction hash.
  async getTransactionReceiptByTxHash(txHash: string) {
    const _txHash: TxHash = TxHash.fromString(txHash);

    const txReceipt = await this.pxe.getTxReceipt(_txHash);
    if (!txReceipt) {
      throw new NotFoundException('Transaction receipt not found');
    }

    return txReceipt;
  }

  // Returns a transaction for a given transaction hash.
  async getTransactionByTxHash(txHash: string) {
    const _txHash: TxHash = TxHash.fromString(txHash);

    const [receipt, effects, notes] = await Promise.all([
      this.pxe.getTxReceipt(_txHash),
      this.pxe.getTxEffect(_txHash),
      this.pxe.getIncomingNotes({ txHash: _txHash, status: NoteStatus.ACTIVE_OR_NULLIFIED }),
    ]);

    if (!receipt) {
      throw new NotFoundException('Transaction receipt not found');
    }

    if (!effects) {
      throw new NotFoundException('Transaction effects not found');
    }

    if (!notes) {
      throw new NotFoundException('Transaction notes not found');
    }

    return { 'receipt': receipt, 'effects': effects, 'notes': notes }

  }

  async getTransactions(fromBlock: number, toBlock: number) {

  }

  async getTransactionsInBlock(blockNumber: number) {
    const block = await this.pxe.getBlock(blockNumber);
    if (!block) {
      throw new NotFoundException('Block not found');
    }

    const transactions = []
    if (block.body.txEffects.length > 0) {
      for (const txHash of block.body.txEffects.map(tx => tx.txHash)) {
        const transaction = await this.getTransactionByTxHash(txHash.toString());
        transactions.push(transaction);
      }
    }

    return transactions
  }

  // Returns a Contact Instance given its address
  async getContractByAddress(address: string) {
    const _address: AztecAddress = AztecAddress.fromString(address);

    const contract = await this.pxe.getContractInstance(_address);

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    return contract;

  }

  // Returns the addresses of contracts added to this PXE Service.
  async getContracts() {
    return await this.pxe.getContracts()
  }

}

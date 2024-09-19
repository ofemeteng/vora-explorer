import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { IndexerService } from './indexer.service.js';
// import { DataService } from './data.service.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('v1')
export class IndexerController {
  constructor(private readonly indexerService: IndexerService) { }

  @ApiTags('blocks')
  @ApiOperation({ summary: 'Get current block number on chain' })
  @ApiResponse({ status: 200, description: 'Returns the current block number on chain.' })
  @Get('get-current-block-number')
  async getCurrentBlockNumber() {
    const number = await this.indexerService.getCurrentBlockNumber();
    return { 'data': { 'currentBlockNumber': number } }
  }

  @ApiTags('blocks')
  @ApiOperation({ summary: 'Get block by block number' })
  @ApiResponse({ status: 200, description: 'Returns a block.' })
  @Get('get-block/:blockNumber')
  async getBlockByNumber(@Param('blockNumber', ParseIntPipe) blockNumber: number) {
    const block = await this.indexerService.getBlockByNumber(blockNumber);
    return { 'data': { 'block': block } }
  }

  @ApiTags('blocks')
  @ApiOperation({ summary: 'Get blocks' })
  @ApiResponse({ status: 200, description: 'Returns the blocks in the specified block number range.' })
  @Get('get-blocks/from/:fromBlock/to/:toBlock')
  async getBlocks(@Param('fromBlock') fromBlock: number, @Param('toBlock') toBlock: number) {
    return { 'data': { 'message': 'Not Yet Implemented' } }
    // return await this.indexerService.getBlocks(fromBlock, toBlock);
  }

  @ApiTags('transactions')
  @ApiOperation({ summary: 'Get transaction Receipt' })
  @ApiResponse({ status: 200, description: 'Returns a transaction receipt for a given transaction hash.' })
  @Get('get-transaction-receipt-by-txhash/:txHash')
  async getTransactionReceiptByTxHash(@Param('txHash') txHash: string) {
    const txReceipt = await this.indexerService.getTransactionReceiptByTxHash(txHash);
    return { data: { 'txReceipt': txReceipt } }
  }

  @ApiTags('transactions')
  @ApiOperation({ summary: 'Get transaction' })
  @ApiResponse({ status: 200, description: 'Returns a transaction for a given transaction hash.' })
  @Get('get-transaction-by-txhash/:txHash')
  async getTransactionByTxHash(@Param('txHash') txHash: string) {
    const transaction = await this.indexerService.getTransactionByTxHash(txHash);
    return { 'data': { 'transaction': transaction } }
  }

  @ApiTags('transactions')
  @ApiOperation({ summary: 'Get transactions in a block' })
  @ApiResponse({ status: 200, description: 'Returns the transactions in a specific block.' })
  @Get('get-transactions-in-block/:blockNumber')
  async getTransactionsInBlock(@Param('blockNumber', ParseIntPipe) blockNumber: number) {
    const transactions = await this.indexerService.getTransactionsInBlock(blockNumber);
    return { 'data': { 'transactions': transactions } }
  }

  @ApiTags('transactions')
  @ApiOperation({ summary: 'Get transactions' })
  @ApiResponse({ status: 200, description: 'Returns the transactions in the specified block number range.' })
  @Get('get-transactions/from/:fromBlock/to/:toBlock')
  async getTransactions(@Param('fromBlock') fromBlock: number, @Param('toBlock') toBlock: number) {
    return { 'data': { 'message': 'Not Yet Implemented' } }
    // return await this.indexerService.getTransactions(fromBlock, toBlock);
  }

  @ApiTags('contracts')
  @ApiOperation({ summary: 'Get contract instance' })
  @ApiResponse({ status: 200, description: 'Returns a Contact Instance given its address.' })
  @Get('get-contract-by-address/:address')
  async getContractByAddress(@Param('address') address: string) {
    const contract = await this.indexerService.getContractByAddress(address);
    return { 'data': { 'contract': contract } }
  }

  @ApiTags('contracts')
  @ApiOperation({ summary: 'Get contracts' })
  @ApiResponse({ status: 200, description: 'Returns the addresses of contracts added to this PXE Service.' })
  @Get('get-contracts')
  async getContracts() {
    const contracts = await this.indexerService.getContracts();
    return { 'data': { 'contracts': contracts } }
  }

}

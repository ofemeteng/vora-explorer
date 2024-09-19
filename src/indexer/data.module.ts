import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block, Transaction, Contract } from './indexer.entity.js';
import { DataService } from './data.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([Block, Transaction, Contract])],
    providers: [DataService],
    exports: [TypeOrmModule],
    // exports: [DataService],
})
export class DataModule { }
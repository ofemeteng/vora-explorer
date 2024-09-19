import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service.js';
import { IndexerController } from './indexer.controller.js';

@Module({
  controllers: [IndexerController],
  providers: [IndexerService],
})
export class IndexerModule { }

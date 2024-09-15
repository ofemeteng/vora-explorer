import { Module, Global } from '@nestjs/common';
import { PxeService } from './pxe.service.js';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [PxeService, ConfigService],
  exports: [PxeService],
})
export class PxeModule { }
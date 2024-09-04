import { Module, Global } from '@nestjs/common';
import { PxeService } from './pxe.service.js';

@Global()
@Module({
  providers: [PxeService],
  exports: [PxeService],
})
export class PxeModule {}
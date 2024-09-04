import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { PxeModule } from './pxe/pxe.module.js';
import { AppService } from './app.service.js';
import { WalletController } from './wallet/wallet.controller.js';
import { WalletService } from './wallet/wallet.service.js';


@Module({
  imports: [PxeModule],
  controllers: [AppController, WalletController],
  providers: [AppService, WalletService],
})
export class AppModule { }





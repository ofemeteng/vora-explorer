import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletController } from './wallet/wallet.controller';
import { WalletService } from './wallet/wallet.service';
import { join } from 'path';


// @Module({
  // imports: [
  //   ServeStaticModule.forRoot({
  //     rootPath: join(__dirname, '..', 'public'),
  //   }),
  // ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule { }

@Module({
  imports: [],
  controllers: [AppController, WalletController],
  providers: [AppService, WalletService],
})
export class AppModule { }





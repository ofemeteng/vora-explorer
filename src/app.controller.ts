import { Controller, Get, Res, Post, Render } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  root() {
    return {};
  }

  @Post('create-wallet')
  createWallet(@Res() res: Response) {
    // return this.appService.createWallet();
    return res.render(
      this.appService.createWallet()
    );
    
  }

  // @Get('send')
  // getSend(@Res() res): string {
  //   return this.appService.getSend(res);
  // }

  // @Get('receive')
  // getReceive(): string {
  //   return this.appService.getReceive();
  // }
}

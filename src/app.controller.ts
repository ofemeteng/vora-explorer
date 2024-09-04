import { Controller, Get, Req, Res, Post, Render } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  root(@Req() req: Request, @Res() res: Response) {
    return res.render(
      this.appService.determineHomepage(req), { title: 'Vora Wallet' }
    );
  }

}

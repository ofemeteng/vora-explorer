import { Injectable, Req, Res } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppService {
  
  determineHomepage(req: Request): string {
    // Logic to show signup page or something else
    return 'index';
  }

}

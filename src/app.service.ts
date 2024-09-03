import { Injectable, Req, Res } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppService {
  
  determineHomepage(@Req() req: Request): string {
    // Logic to show signup page or something else
    return 'index';
  }

  getSend(@Res() res): string {
    const transactionForm = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Send Form</h2>
        <form>
          <!-- Form fields go here -->
        </form>
      </div>
    `;
    return res.send(transactionForm);
  }

}

import { Injectable, Res } from '@nestjs/common';

@Injectable()
export class AppService {
  createWallet(): string {
    return 'home';
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

  getReceive(): string {
    return 'Receive';
  }


}

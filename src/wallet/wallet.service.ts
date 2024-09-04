import { Req, Res, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { SendDto } from './dto/send.dto.js';

@Injectable()
export class WalletService {
    // createWallet(@Res() res: Response) : string {
    //     // Logic to create a new wallet
    //     const htmlString = `
    //         <h2 class="text-xl font-semibold text-gray-700 mb-6">Create Wallet</h2>
    //         <form hx-post="/send" hx-target="this" hx-swap="outerHTML">
                
    //             <div class="mb-4">
    //                 <label for="recipient" class="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
    //                 <input type="text" id="recipient" name="recipient" placeholder="Choose a unique username" class="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
    //             </div>
    //             <div class="flex justify-between">
    //                 <button type="button" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full flex-1 mr-2" hx-get="/" hx-target="body" hx-swap="innerHTML">
    //                     Back
    //                 </button>
    //                 <button type="submit" class="bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full flex-1 ml-2">
    //                     Continue
    //                 </button>
    //             </div>
    //         </form>
    //     `;

    //     return htmlString;
    // }

    // createWallet(@Req() req: Request): string {
    //     return 'create-wallet';
    //   }

    importWallet(privateKey: string) {
        // Logic to import an existing wallet using the private key
        return { message: 'Wallet imported successfully' };
    }

    send(sendDto: SendDto) {
        // Logic to send funds
        return { message: 'Funds sent successfully' };
    }

    getBalance() {
        // Logic to get wallet balance
        return 100; // Example balance
    }

    getAddress() {
        // Logic to get wallet address
        return '0xYourWalletAddress'; // Example address
    }

    getTransactions() {
        // Logic to get wallet transactions
        return [
            { id: 1, amount: 50, type: 'sent' },
            { id: 2, amount: 20, type: 'received' },
        ]; // Example transactions
    }
}
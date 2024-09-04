import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PXE, createPXEClient, waitForPXE } from '@aztec/aztec.js';

@Injectable()
export class PxeService implements OnModuleInit {
  private readonly logger = new Logger(PxeService.name);
  private pxe: PXE;

  async onModuleInit() {
    await this.initializePxe();
  }

  private async initializePxe() {
    try {
        const PXE_URL = 'http://localhost:8080';
        this.pxe = createPXEClient(PXE_URL);
        await waitForPXE(this.pxe);
        this.logger.log('PXE client initialized successfully');
      } catch (error) {
        this.logger.error('Failed to initialize PXE client', error);
        throw new Error('Unable to initialize PXE client');
      }
  }

  getPxe(): PXE {
    if (!this.pxe) {
        this.logger.log('Failed to initialize PXE client');
        throw new Error('PXE client not initialized');
    }
    return this.pxe;
  }
}
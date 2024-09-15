import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PXE, createPXEClient, waitForPXE } from '@aztec/aztec.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PxeService implements OnModuleInit {
  private readonly logger = new Logger(PxeService.name);
  private pxe: PXE;
  private PXE_URL: string;

  constructor(private readonly configService: ConfigService) {
    this.PXE_URL = this.configService.get<string>('PXE_URL');
  }

  async onModuleInit() {
    await this.initializePxe();
  }

  private async initializePxe() {
    try {
      const PXE_URL = this.PXE_URL || 'http://localhost:8080';
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
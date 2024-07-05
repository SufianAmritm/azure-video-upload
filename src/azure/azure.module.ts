import { Module } from '@nestjs/common';
import { AzureService } from './azure.service';
import { AzureController } from './azure.controller';
import { MulterAzureStorage } from 'multer-azure-blob-storage';
import { MulterModule } from '@nestjs/platform-express';
import { getStorage } from 'src/multer/storage';

@Module({
  imports: [],
  providers: [AzureService],
  controllers: [AzureController],
})
export class AzureModule {}

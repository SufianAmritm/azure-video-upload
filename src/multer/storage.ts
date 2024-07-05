import {
  BlobServiceClient,
  BlockBlobUploadStreamOptions,
  ContainerClient,
} from '@azure/storage-blob';
require('dotenv').config();
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import multer from 'multer';

export class MulterAzureStorage implements multer.StorageEngine {
  private readonly client: ContainerClient;
  private readonly azureConnection: string;
  constructor(configService: ConfigService) {
    this.azureConnection = configService.getOrThrow('AZURE_CONNECTION_STRING');
    this.client = this.getBlobClient('proposal');
  }
  async _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): Promise<void> {
    const customName = file.originalname + '123';
    file.originalname = customName;
    const blobClient = this.client.getBlockBlobClient(customName);
    const startTime = new Date();
    console.log(`Start Time: ${startTime.toISOString()}`);

    const uploadStream = await blobClient.uploadStream(
      file.stream,
      10000,
      1000,
      {
        blobHTTPHeaders: {
          blobContentType: 'application/octet-stream',
        },
      },
    );
    const endTime = new Date();
    console.log(`End Time: ${endTime.toISOString()}`);
    callback(null, {
      filename: customName,
    });
    req['blobResponse'] = uploadStream;
  }
  _removeFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null) => void,
  ): void {
    const blobClient = this.client.getBlockBlobClient(file.originalname);
    blobClient
      .delete()
      .then(() => {
        console.log(`Deleted blob: ${file.filename}`);
        callback(null);
      })
      .catch((err) => {
        console.error(`Error deleting blob: ${file.filename}`);
        callback(err);
      });
  }

  getBlobClient(container: string): ContainerClient {
    console.log(`Getting blob client: ${container}`);
    console.log(this.azureConnection);
    const blobService = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    return blobService.getContainerClient(container);
  }
}
export function getStorage() {
  const configService = new ConfigService();
  return new MulterAzureStorage(configService);
}

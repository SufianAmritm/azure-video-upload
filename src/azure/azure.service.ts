import {
  BlobServiceClient,
  BlockBlobClient,
  BlockBlobUploadStreamOptions,
} from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { PassThrough } from 'stream';
import * as uuid from 'uuid';
@Injectable()
export class AzureService {
  private readonly azureConnection: string;
  constructor() {
    this.azureConnection = process.env.AZURE_CONNECTION_STRING;
  }

  private async getBlobServiceInstance() {
    return BlobServiceClient.fromConnectionString(this.azureConnection);
  }
  private async getBlobClient(
    imageName: string,
    folder: string,
  ): Promise<BlockBlobClient> {
    const blobService = await this.getBlobServiceInstance();
    const containerClient = blobService.getContainerClient(folder);
    return containerClient.getBlockBlobClient(imageName);
  }
  async uploadVideo(file: Express.Multer.File, folder: string) {
    const startTime = new Date();
    console.log(`Start Time: ${startTime.toISOString()}`);
    // return true;
    try {
      const size = file.size;
      const extension = file.originalname.split('.').pop();
      const fileName = `${uuid.v4()}.${extension}`;
      const readableStream = new PassThrough();
      readableStream.end(file.buffer);

      const blockBlobClient = await this.getBlobClient(fileName, folder);
      const uploadOptions: BlockBlobUploadStreamOptions = {
        onProgress: (progress) => {
          const percentage = (progress.loadedBytes / size) * 100;
          console.log(`Upload progress: ${percentage.toFixed(2)}%`);
        },
      };

      const data = await blockBlobClient.uploadStream(
        readableStream,
        10000,
        1000,
        {
          ...uploadOptions,

          blobHTTPHeaders: {
            blobContentType: 'application/octet-stream',
          },
        },
      );
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      const endTime = new Date();
      console.log(`End Time: ${endTime.toISOString()}`);

      const duration = endTime.getTime() - startTime.getTime();
      console.log(`Function Execution Time: ${duration} ms`);
    }
  }
}

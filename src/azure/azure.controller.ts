import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AzureService } from './azure.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { getStorage } from 'src/multer/storage';
@Controller('azure')
export class AzureController {
  constructor(private readonly azureService: AzureService) {}
  @Post('uploadVideo')
  @ApiBody({
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { folder: string },
  ) {
    console.log('File uploaded to server: ' + new Date().toISOString());
    const { folder } = body;
    return await this.azureService.uploadVideo(file, folder);
  }
  @Post('uploadVideo/custom')
  @ApiBody({
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: getStorage() }))
  async uploadVideoWithCustomStorage(
    @UploadedFile() file: Express.Multer.File,

    @Body() body: { folder: string },
    @Req() req: any,
  ) {
    console.log(file.filename);
    console.log('File uploaded to server: ' + new Date().toISOString());
    const { folder } = body;
    console.log(req['blobResponse']);
    return await this.azureService.uploadVideoWithCustomStorage();
  }
}

import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AzureService } from './azure.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

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
}

import {
  Controller, Post,
  UploadedFile,
  UploadedFiles, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { mimeTypeToMediaType } from 'src/helpers/functions/common.utils';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
    @Post('')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
        required: ['files'],
      },
    })
    @UseInterceptors(FilesInterceptor('files', 100))
  async uploadFiles(@UploadedFiles(
  ) files: Array<Express.Multer.File>) {
    return {
      data: files.map((file) => ({
        uri: `${file.destination.split('/public/')[1]}/${file.filename}`,
        fileType: mimeTypeToMediaType(file.mimetype)
      })),
    };
  }

    @Post('/single')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
        required: ['file'],
      },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      console.info('file', file)
      return {
        uri: `${file.destination.split('/public/')[1]}/${file.filename}`,
        fileType: mimeTypeToMediaType(file.mimetype)
      };
    }
}

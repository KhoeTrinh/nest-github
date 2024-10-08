import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/')
  GetFiles(@Req() req: Request) {
    return this.appService.getFiles(req)
  }

  @Get('/:id')
  GetFile(@Req() req: Request, @Param('id') id: string) {
    return this.appService.getFile(req, id)
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    return this.appService.uploadFile(req, file);
  }

  @Post('/convert')
  convertFile(@Body() data: any) {
    return this.appService.convertFile(data);
  }
}

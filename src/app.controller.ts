import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(@Req() req: Request) {
    return this.appService.getHello(req);
  }
  @Post('/')
  createHello(@Body() data: any) {
    return this.appService.createHello(data)
  }
}

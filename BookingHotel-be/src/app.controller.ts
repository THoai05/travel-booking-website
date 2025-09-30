import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // route gốc
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET /
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // GET /test
  @Get('test')
  getTest(): any {
    return { message: 'Backend is running!' };
  }
}

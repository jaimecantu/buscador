import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  readAll() {
    return this.appService.readAll();
  }

  @Get(':name')
  readFile(@Param("name") name: string) {
    return this.appService.readFile(name);
  }

  @Get('remove/tags')
  removeTags() {
    return this.appService.removeTags();
  }

  @Get('process/words')
  words() {
    return this.appService.words();
  }
}

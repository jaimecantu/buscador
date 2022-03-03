import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  readAll() {
    return this.appService.readAll();
  }

  @Get(":name")
  readFile(@Param("name") name: string) {
    return this.appService.readFile(name);
  }

  @Get("remove/tags")
  removeTags() {
    return this.appService.removeTags();
  }

  @Get("process/words")
  words() {
    return this.appService.words();
  }

  @Get("process/consolidate")
  consolidated() {
    return this.appService.consolidate();
  }

  @Get("process/tokenize")
  tokenize() {
    return this.appService.tokenize();
  }

  @Get("process/counter")
  counter() {
    return this.appService.counter();
  }
}

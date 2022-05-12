import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/:word")
  optimizedSearch(@Param("word") word: string) {
    return this.appService.optimizedSearch(word);
  }
}

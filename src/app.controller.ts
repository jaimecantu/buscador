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

  @Get("process/posting")
  posting() {
    return this.appService.posting();
  }

  @Get("process/hash")
  hash() {
    return this.appService.hashtable();
  }

  @Get("process/stoplist")
  stoplist() {
    return this.appService.stoplist();
  }

  @Get("process/weight")
  weightTokens() {
    return this.appService.weightTokens();
  }

  @Get("process/documents")
  documents() {
    return this.appService.documents();
  }

  @Get("process/index")
  createIndex() {
    return this.appService.createIndex();
  }

  @Get("process/search/:word")
  search(@Param("word") word: string) {
    return this.appService.search(word);
  }

  @Get("process/optimized/:word")
  optimizedSearch(@Param("word") word: string) {
    return this.appService.optimizedSearch(word);
  }
}

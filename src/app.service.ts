import { ConsoleLogger, Injectable } from '@nestjs/common';
const fs = require('fs');

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async readFile(name: string) {
    const start = Date.now();
    let end;
    let response = {};
    let file;
    try {
      file = fs.readFileSync(`./src/files/${name}.html`, 'utf-8');
    } catch (err) {
      return {error: "Archivo no encontrado"}
    }
    
    end = Date.now();
    response = {
      start: start,
      end: end,
      time: end - start,
      file: file
    };

    //fs.writeFileSync('./src/output/logs/act-1.txt', `${name}.html \t \t${end-start} ms`)
    
    let log = `\n${name}.html\t\t\t\t${end - start} ms`;
    fs.appendFile('./src/output/logs/act-1.txt', log, (err) => {
      return { error: "Error al actualizar los logs" };
    })

    return response;
  }
}

import { ConsoleLogger, Injectable } from '@nestjs/common';
const fs = require('fs');
const date = require("date-and-time");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
@Injectable()
export class AppService {

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

  async readAll() {
    //Paso 1: Obtener los nombres de todos los archivos en el directorio
    await fs.readdir('./src/files', async (err, files) => {
      if (err) {
        return { error: `Error al leer los archivos: ${err}` };
      }

      //Paso 2: Crear el archivo con el reporte de los totales
      fs.writeFileSync('./src/output/logs/total.txt', `Archivo\t\t\t\t\tTiempo\n-----------------------------------`);

      //Paso 3: Abrir cada uno y documentar el tiempo que se tarda
      let totalTime = 0;
      let totalFiles = files.length;

      await files.forEach((name) => {
        let start = Date.now();
        let end;
        let response = {};
        let file;
        try {
          file = fs.readFileSync(`./src/files/${name}`, "utf-8");
        } catch (err) {
          return { error: "Archivo no encontrado" };
        }
        end = Date.now();
        let log = `\n${name}\t\t\t\t${end - start} ms`;
        totalTime += (end-start);
        fs.appendFile("./src/output/logs/total.txt", log, (err) => {
          return { error: "Error al actualizar los logs" };
        });
      });
      
      await delay(500);

      //Paso 4: Agregar totales al reporte
      fs.appendFile(
        "./src/output/logs/total.txt",
        `\n-----------------------------------\n${totalFiles} archivos\t\t\t${totalTime} ms`,
        (err) => {
          return { error: "Error al actualizar los logs" };
        }
      );
    })
  }
}

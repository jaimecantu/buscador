import { ConsoleLogger, Injectable } from "@nestjs/common";
const fs = require("fs");
const gracefulFs = require("graceful-fs");
const date = require("date-and-time");
var striptags = require("striptags");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const write = require("write-file-utf8");
import { uuid } from "uuidv4";
const globalDictionary = JSON.parse(
  fs.readFileSync("./src/output/posting/posting.json", "utf-8")
);
@Injectable()
export class AppService {

  async optimizedSearch(word: string) {
    //1. Sanitizar la palabra a buscar
    let sanitized = word.toLowerCase().replace(/[^\x00-\x7F]/g, "");
    if (sanitized.length < 1) {
      return { error: "Ingresa caracteres válidos únicamente" };
    }

    //3. Si la palabra existe, regresar el listado de documentos que la contienen
    const keys = Object.keys(globalDictionary);

    if (keys.includes(sanitized)) {
      let result = globalDictionary[sanitized];
      //4. Ordenar los resultados por frecuencia (mayor a menor)
      let reducedFiles = Object.entries(result.files);
      let sortedFiles = reducedFiles.sort((a, b) =>
        a[1]> b[1] ? -1 : 1
      );
      result.files = Object.fromEntries(sortedFiles);
      //Si la palabra aparece en 10 archivos o menos, regresar el resultado completo
      if (result.totalFiles <= 10 ){
        return result;
      }
      //Si la palabra aparece en más de 10, regresar únicamente el top 10
      
      reducedFiles.length = 10;
      result.files = Object.fromEntries(reducedFiles);
      return result;
      
    }

    //4. Si la palabra no existe, regresar un mensaje de error
    return { error: "No se encontraron documentos con esa palabra" };
  }

  calculateWeight(file: string){
    return Math.random();
  }

}

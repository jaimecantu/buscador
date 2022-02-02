import { ConsoleLogger, Injectable } from "@nestjs/common";
const fs = require("fs");
const date = require("date-and-time");
var striptags = require("striptags");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
@Injectable()
export class AppService {
  async readFile(name: string) {
    const start = Date.now();
    let end;
    let response = {};
    let file;
    try {
      file = fs.readFileSync(`./src/files/${name}.html`, "utf-8");
    } catch (err) {
      return { error: "Archivo no encontrado" };
    }

    end = Date.now();
    response = {
      start: start,
      end: end,
      time: end - start,
      file: file,
    };

    //fs.writeFileSync('./src/output/logs/act-1.txt', `${name}.html \t \t${end-start} ms`)

    let log = `\n${name}.html\t\t\t\t${end - start} ms`;
    fs.appendFile("./src/output/logs/act-1.txt", log, (err) => {
      return { error: "Error al actualizar los logs" };
    });

    return response;
  }

  async readAll() {
    //Paso 1: Obtener los nombres de todos los archivos en el directorio
    await fs.readdir("./src/files", async (err, files) => {
      if (err) {
        return { error: `Error al leer los archivos: ${err}` };
      }

      //Paso 2: Crear el archivo con el reporte de los totales
      fs.writeFileSync(
        "./src/output/logs/total.txt",
        `Archivo\t\t\t\t\tTiempo\n-----------------------------------`
      );

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
        totalTime += end - start;
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
    });
  }

  async removeTags() {
    // 0. Tomar la fecha inicial antes de comenzar la función

    // 1. Obtener los nombres de todos los archivos

    //2. Abrir cada uno, guardar el contenido en un string
    // Tomamos la fecha inicial desde que se abre el archivo

    //3. Utilizar la librería string-strip-html para remover las etiquetas
    // Tomamos la fecha final de cada archivo
    const output = striptags(
      `<H2>Statement of<BR>
<BR>
Janlori Goldman<BR>
Deputy Director<BR>
Center for Democracy and Technology<BR>
<BR>
Before the<BR>
House Committee on Government Reform and Oversight<BR>
Subcommittee on Government Management, Information and Technology<BR>
on <BR>
Medical Records Confidentiality
<P>
June 14, 1996</CENTER>
</H2>`);

  return output;

    //4. Crear un nuevo archivo .txt con el nuevo string

    //5. Al terminar, agregar al log act-2.txt el nombre y tiempo de cada archivo

    //6. Agregar los totales al log act-2.txt


  }
}

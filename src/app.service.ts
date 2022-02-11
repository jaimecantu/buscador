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
    const totalStart = Date.now();

    // 1. Obtener los nombres de todos los archivos
    await fs.readdir("./src/files", async (err, files) => {
      if (err) {
        return { error: `Error al leer los archivos: ${err}` };
      }

      //Paso 1.2: Crear el archivo con el reporte de los totales
      fs.writeFileSync(
        "./src/output/logs/act-2.txt",
        `Archivo\t\t\t\t\tTiempo\n-----------------------------------`
      );

      //2. Abrir cada uno, guardar el contenido en un string
      // Tomamos la fecha inicial desde que se abre el archivo

      let totalTime = 0;
      let totalFiles = files.length;

      await files.forEach((name) => {
        let start = Date.now();
        let end;
        let file;
        try {
          file = fs.readFileSync(`./src/files/${name}`, "utf-8");
        } catch (err) {
          return { error: "Archivo no encontrado" };
        }

        //3. Utilizar la librería string-strip-html para remover las etiquetas
        let output = striptags(file);
        // Tomamos la fecha final de cada archivo
        end = Date.now();

        //4. Al terminar, agregar al log act-2.txt el nombre y tiempo de cada archivo
        let log = `\n${name}\t\t\t\t${end - start} ms`;
        //totalTime += end - start;
        fs.appendFile("./src/output/logs/act-2.txt", log, (err) => {
          return { error: "Error al actualizar los logs" };
        });

        //5 Crear nuevo archivo .txt con el texto sin etiquetas
        const newName = name.split(".");
        fs.writeFileSync(`./src/output/parsed/${newName[0]}.txt`, output);
      });

      await delay(100);
      //Obtener la fecha final
      const totalEnd = Date.now();

      totalTime = totalEnd - totalStart;

      //Paso 4: Agregar totales al reporte
      fs.appendFile(
        "./src/output/logs/act-2.txt",
        `\n-----------------------------------\n${totalFiles} archivos\t\t\t${totalTime} ms`,
        (err) => {
          return { error: "Error al actualizar los logs" };
        }
      );

      return { message: "Etiquetas eliminadas exitosamente" };
    });
  }

  async words() {
    // 0. Tomar la fecha inicial antes de comenzar la función
    const totalStart = Date.now();

    // 1. Obtener los nombres de todos los archivos
    await fs.readdir("./src/output/parsed", async (err, files) => {
      if (err) {
        console.log("Error al leer los archivos. " + err);
      }
      //Paso 1.2: Crear el archivo con el reporte de los totales
      try {
        fs.writeFileSync(
          "./src/output/logs/act-3.txt",
          `Archivo\t\t\t\t\tTiempo\n-----------------------------------`
        );
      } catch (error) {
        console.error(error);
      }

      //2. Abrir cada uno, guardar el contenido en un string
      // Tomamos la fecha inicial desde que se abre el archivo

      let totalTime = 0;
      let totalFiles = files.length;

      await files.forEach(async (name) => {
        //console.log(name);
        if (name != ".DS_Store") {
          let start = Date.now();
          let end;
          let file;
          try {
            file = fs.readFileSync(`./src/output/parsed/${name}`, "utf-8");
          } catch (err) {
            console.log("Archivo no encontrado. " + name);
          }

          //Paso 2. Guardar las palabras en un arreglo, separando el string cada " "
          let parsedFile = file
            .trim()
            .replace(/[\t\r\n\"-.,:;?!$#-%&¿¡()/0123456789]+/gm, " ");
          let lowerCase = parsedFile.toLowerCase();
          let wordArray = lowerCase.split(" ");

          //Paso 3. Ordenar alfabéticamente las palabras en el arreglo
          let sortedWords = wordArray.sort();
          // Tomamos la fecha final de cada archivo
          end = Date.now();

          //console.log(name + end);
          let fileString = "";
          try {
            await sortedWords.forEach(async (word) => {
              if (word.trim().length > 0) {
                fileString += `${word}\n`;
              }
            });
            fileString.replace(/[^A-Za-z0-9]/g, "¿");
            fs.writeFileSync(`src/output/words/${name}`, fileString);
            await delay(500);
          } catch (error) {
            console.log("Error al crear el archivo " + name);
            console.error(error);
          }
          //4. Al terminar, agregar al log act-3.txt el nombre y tiempo de cada archivo
          let log = `\n${name}\t\t\t\t${end - start} ms`;
          //totalTime += end - start;
          await delay(500);
          await fs.appendFile("./src/output/logs/act-3.txt", log, (err) => {
            if (err) {
              console.log("Error al guardar los logs del archivo " + name);
              throw err;
            }
          });
        } else {
          totalFiles--;
        }
      });

      await delay(500);
      //Obtener la fecha final
      const totalEnd = Date.now();

      totalTime = totalEnd - totalStart;
      await delay(5000);
      //Paso 4: Agregar totales al reporte
      fs.appendFile(
        "./src/output/logs/act-3.txt",
        `\n-----------------------------------\n${totalFiles} archivos\t\t\t${totalTime} ms`,
        (err) => {
          if (err) {
            console.log("Error al guardar los totales");
            console.log(err);
            throw err;
          }
        }
      );

      return { message: "Palabras guardadas exitosamente" };
    });
  }
}

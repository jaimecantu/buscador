import { ConsoleLogger, Injectable } from "@nestjs/common";
const fs = require("fs");
const date = require("date-and-time");
var striptags = require("striptags");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const write = require("write-file-utf8");
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
        "./src/output/logs/act-1-total.txt",
        `Archivo\t\t\t\t\tTiempo\n-----------------------------------`
      );

      //Paso 3: Abrir cada uno y documentar el tiempo que se tarda
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
        end = Date.now();
        let log = `\n${name}\t\t\t\t${end - start} ms`;
        totalTime += end - start;
        fs.appendFile("./src/output/logs/act-1-total.txt", log, (err) => {
          return { error: "Error al actualizar los logs" };
        });
      });

      await delay(500);

      //Paso 4: Agregar totales al reporte
      fs.appendFile(
        "./src/output/logs/act-1-total.txt",
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
        if (name != ".DS_Store") {
          let start = Date.now();
          let end;
          let file;
          try {
            file = fs.readFileSync(`./src/output/parsed/${name}`, "utf-8");
            file = file.replace(/[^\x00-\x7F]/g, "");
          } catch (err) {
            console.log("Archivo no encontrado. " + name);
          }

          //Paso 2. Guardar las palabras en un arreglo, separando el string cada " "
          let parsedFile = file
            .trim()
            .replace(/[\t\r\n\"-.,:;?@!$#-%&¿¡=<>~()/0123456789]+/gm, " ");
          let lowerCase = parsedFile.toLowerCase();
          let wordArray = lowerCase.split(" ");

          //Paso 3. Ordenar alfabéticamente las palabras en el arreglo
          let sortedWords = wordArray.sort();
          // Tomamos la fecha final de cada archivo
          end = Date.now();

          let fileString = "";
          try {
            await sortedWords.forEach(async (word) => {
              let sanitized = word.replace(/[\`\[\]\_\|\-\{\}\\]/g, "");
              
              if (sanitized.trim().length > 0) {
                fileString += `${sanitized}\n`;
              }
            });
            fs.writeFileSync(`./src/output/words/${name}`, fileString);
            await delay(500);
          } catch (error) {
            console.log("Error al crear el archivo " + name);
            console.error(error);
          }
          //4. Al terminar, agregar al log act-3.txt el nombre y tiempo de cada archivo
          let log = `\n${name}\t\t\t\t${end - start} ms`;

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

  async consolidate() {
    //1. Obtener todos los nombres de los archivos
    await fs.readdir("./src/output/words", async (err, files) => {
      if (err) {
        console.log(err);
      }

      let totalFiles = files.length;

      //2. Crear el archivo consolidado y el log
      fs.writeFileSync(
        "./src/output/logs/act-4.txt",
        `Archivo\t\t\t\t\tTiempo\n-----------------------------------`
      );

      let totalString = "";

      //2.1 Iniciar la medición del tiempo total
      const totalStart = Date.now();

      //3. Agregar el contenido de cada archivo al consolidado
      await files.forEach(async (name) => {
        if (name != ".DS_Store") {
          let start = Date.now();
          let end;
          let file;
          try {
            file = fs.readFileSync(`./src/output/words/${name}`, "utf-8");
          } catch (err) {
            return { error: "Archivo no encontrado" };
          }

          totalString += `\n${file}`;

          //3.1 Medir el tiempo de cada archivo y agregarlo al log
          end = Date.now();
          let log = `\n${name}\t\t\t\t${end - start} ms`;
          fs.appendFile("./src/output/logs/act-4.txt", log, (err) => {
            if (err) console.log("Error al actualizar los logs - " + name);
          });
          await delay(1000);
        } else {
          totalFiles--;
        }
      });

      fs.writeFileSync("./src/output/consolidated.txt", totalString);

      //4. Al finalizar, obtener el tiempo total para la creación del archivo consilidado
      // y agregarlo al log
      let consolidatedEnd = Date.now() - totalStart;
      await delay(1000);
      fs.appendFile(
        "./src/output/logs/act-4.txt",
        `\n-----------------------------------\n${totalFiles} archivos\t\t\t${consolidatedEnd} ms`,
        (err) => {
          if (err) console.log("Error al actualizar los logs 2 - ");
        }
      );

      await delay(500);

      //5. Ordenar alfabéticamente el archivo consolidado
      let consolidated;
      try {
        consolidated = fs.readFileSync(
          `./src/output/consolidated.txt`,
          "utf-8"
        );
        //let sanitized = consolidated.replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g,"");
        let sanitized = consolidated.replace(/[^A-Za-z0-9\n\r]/g, "");
        let escaped = sanitized.replace(/^\s*[\r\n]/gm, "");
        let wordArray = await escaped.split(/\r?\n/);
        console.log("Total de palabras: " + wordArray.length);
        let sortedWords = await wordArray.sort();
        sortedWords.shift();
        let consolidatedString = await sortedWords.join(`\r\n`);

        fs.writeFileSync(
          "./src/output/sortedConsolidated.txt",
          consolidatedString
        );
      } catch (err) {
        console.log("Archivo consolidado no encontrado");
      }

      //6. Guardar el tiempo total de ejecución en el log
      let totalTime = Date.now() - totalStart;
      fs.appendFile(
        "./src/output/logs/act-4.txt",
        `\n-----------------------------------\nTiempo total de ejecución: \t\t\t${totalTime} ms`,
        (err) => {
          if (err) console.log("Error al actualizar los logs 3");
        }
      );
    });

    return { message: "Archivo consolidado creado exitosamente" };
  }

  async tokenize(){
    const files = ['simple', 'medium', 'hard', '049'];
    let response = [];
    let consolidated = {};

    //0. Crear archivo con el log y tomar medición del tiempo
    let totalStart = Date.now();
    fs.writeFileSync(
      "./src/output/logs/act-5.txt",
      `Archivo\t\t\t\t\tTiempo\n-----------------------------------`
    );

    //1. Abrir cada uno de los archivos especificados
    files.forEach(name => {
      try {
        let start = Date.now();
        let file = fs.readFileSync(`./src/output/words/${name}.txt`, 'utf-8');
        //2. Generar un arreglo a partir de las palabras del archivo
        let sanitized = file.replace(/[^A-Za-z0-9\n\r]/g, "");
        let escaped = sanitized.replace(/^\s*[\r\n]/gm, "");
        let wordArray = escaped.split(/\r?\n/);
        console.log("Total de palabras en " + name + ": " + wordArray.length);

        //3. Ordenar alfabéticamente
        let sortedWords = wordArray.sort();

        //4. Contabilizar las palabras repetidas
        let counter = {};
        sortedWords.forEach(word => {
          if(word.length > 0){
          counter[word] = (counter[word] || 0) + 1;
          consolidated[word] = (consolidated[word] || 0) + 1;
          }
        });

        //5. Crear el archivo de salida
        let json = JSON.stringify(counter);
        let parsed = json.replace(/[\{\}\"]/gm, "");
        let report = parsed.replace(/[\,]/gm, "\n");
        fs.writeFileSync(`./src/output/tokenized/${name}.txt`, report);

        //6. Actualizar log
        let end = Date.now();
        let log = `\n${name}.html\t\t\t\t${end - start} ms`;
        fs.appendFile("./src/output/logs/act-5.txt", log, (err) => {
          return { error: "Error al actualizar los logs" };
        });

        response.push({file: name, counter});
      } catch (err) {
        console.log("Archivo no encontrado: " + name);
        console.log(err);
      }
    });
    console.log("Total de palabras: " + Object.keys(consolidated).length )

    //7. Crear archivo consolidado
    let consolidatedJson = JSON.stringify(consolidated);
    let parsed = consolidatedJson.replace(/[\{\}\"]/gm, "");
    let report = parsed.replace(/[\,]/gm, "\n");
    fs.writeFileSync('./src/output/tokenized/consolidated.txt', report);

    //8. Actualizar log
    let totalTime = Date.now() - totalStart;
    fs.appendFile(
      "./src/output/logs/act-5.txt",
      `\n-----------------------------------\nTiempo total de ejecución: \t\t\t${totalTime} ms`,
      (err) => {
        if (err) console.log("Error al actualizar los logs 3");
      }
    );
    response.push({file: 'consolidated', consolidated});
    return response;
  }
}

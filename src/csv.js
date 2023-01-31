import { parse } from "csv-parse";
import fs from "node:fs";

const path = new URL("../task.csv", import.meta.url);

const readStream = fs.createReadStream(path);

const csvParse = parse({
  fromLine: 2,
  skipEmptyLines: true,
  delimiter: ",",
});

async function convertCSV() {
  const linesParse = readStream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
    await wait(1000);
  }
}

convertCSV();

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

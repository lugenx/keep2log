const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });

rl.question(
  "\n\x1b[33m Enter the name of the folder that exported from Google Keep?\x1b[0m\n\n > ",
  (folderName) => {
    console.log(`Answer is here: ${folderName}`);

    // TODO: Below will read directory and create array of json fles
    fs.readdir(__dirname + `/${folderName}/Keep/`, (err, files) => {
      if (err) {
        console.log("Error getting directory info");
      }
      const jsonFiles = files.filter(
        (file) => path.extname(file).toLocaleLowerCase() === ".json"
      );
      console.log("filllllles", jsonFiles);
    });
    // TODO: Iterate over all json files (jsonFiles) and handle each file and structure data
    // TODO: Below will read the json file
    fs.readFile("test-file.json", "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const jsonData = JSON.parse(data);
      console.log("jsonData here", jsonData);
    });

    rl.close();
  }
);

// console.log("\n\x1b[92m The file has been formatted and saved! \x1b[0m\n");

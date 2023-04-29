const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });
const FILE_PATH = "/Users/elgun/desktop";

rl.question(
  "\n\x1b[33m Enter the name of the folder that exported from Google Keep?\x1b[0m\n\n > ",
  (folderName) => {
    console.log(`Answer is here: ${folderName}`);

    // TODO: Below will read directory and create array of json fles
    try {
      const files = fs.readdirSync(`/${FILE_PATH}/${folderName}/Keep/`);
      const jsonFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === ".json"
      );
      console.log("this runs firs - json files", jsonFiles);
    } catch (error) {
      console.log("Error getting directory info");
    }

    // TODO: Iterate over all json files (jsonFiles) and handle each file and structure data
    console.log("logic goes here");

    // TODO: Below will read the json file
    try {
      const fileContent = fs.readFileSync(`${FILE_PATH}/test-file.json`);
      const jsonData = JSON.parse(fileContent);
      console.log("this runs later - jsonData here", jsonData);
    } catch (error) {
      console.error(error);
    }

    rl.close();
  }
);

// console.log("\n\x1b[92m The file has been formatted and saved! \x1b[0m\n");

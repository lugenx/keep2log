const fs = require("node:fs");
const path = require("node:path");
// const readline = require("node:readline");
const rls = require("readline-sync");
// import psp from "prompt-sync-plus";
// const prompt = psp();
const { stdin: input, stdout: output } = require("node:process");
const convertFile = require("./convertFile.js");
const createOrReturnDirectory = require("./createOrReturnDirectory.js");
const copyAssets = require("./copyAssets.js");

//const rl = readline.createInterface({ input, output });

const FIRST_QUESTION =
  " \n\x1b[1m\x1b[33mEnter the location of downloaded and unzipped 'Google Keep' Takeout folder?\x1b[0m \n\x1b[33m e.g. /Users/<your username>/desktop/\x1b[0m CAUTION: If using Google Keep in other languages, make sure to rename the directory inside Takeout to \'Keep\'!\n\n >.";
const SECOND_QUESTION =
  " \n\x1b[1m\x1b[33mEnter location of your 'Notes' folder (CAUTION: The directory should exist!) or press 'ENTER' if you want to create new 'notes' folder in current location\x1b[0m \n\x1b[33m e.g. /Users/<your username>/Documents/<Logseq Graph name>/\x1b[0m\n\n >";

let sourceDirectory;
let destinationDirectory;
let jsonFiles;

function checkSourcePath(srcpath) {
  const askedFolderLocation = srcpath.trim().replace(/^['"]|['"]$/g, "");
  sourceDirectory = path.normalize(`${askedFolderLocation}/Takeout/Keep/`);

  if (
    !fs.existsSync(sourceDirectory) ||
    !fs.statSync(sourceDirectory).isDirectory()
  ) {
    console.log(
      "\n\x1b[1m\x1b[31mTakeout folder not found! Please try again!\x1b[0m"
    );
    return 1;
  }
  else {
    return 0;
  }
}

function checkDestPath(destpath) {
  const askedDestinationLocation = destpath
  .trim()
  .replace(/^['"]|['"]$/g, "");
destinationDirectory = path.normalize(askedDestinationLocation);

if (
  !fs.existsSync(destinationDirectory) ||
  !fs.statSync(destinationDirectory).isDirectory()
) {
  console.log(
    "\n\x1b[1m\x1b[31mDestination location is not valid! Please try again!\x1b[0m"
  );
  return 1;
  }
  else {
    return 0;
  }
}

function getKeepData() {
  try {
    const files = fs.readdirSync(sourceDirectory);

    jsonFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".json"
    );
  } catch (error) {
    console.log("Error getting directory info");
  }

}

function convertData() {
  let processedFilesCount = 0;
  for (let file of jsonFiles) {
    try {
      const fileContent = fs.readFileSync(`${sourceDirectory}/${file}`);
      const jsonData = JSON.parse(fileContent);
      if (jsonData.isTrashed) continue;
      const { mdFileName, content } = convertFile(jsonData);

      const pathToAppend = createOrReturnDirectory(
        `${destinationDirectory}/notes/`
      );

      fs.appendFileSync(`${pathToAppend}/${mdFileName}`, content);
      processedFilesCount++;
    } catch (error) {
      console.error(error);
    }
  }
  console.log(
    `\n\x1b[92m All notes processed. Total converted notes: ${processedFilesCount}. \n Please look for newly created 'notes' folder in '${
      destinationDirectory === "." ? __dirname : destinationDirectory
    }' directory. \x1b[0m\n`
  );
  copyAssets(sourceDirectory, destinationDirectory);
}

function main() {
  console.log(`Starting! Arguments: ${process.argv[2]}, ${process.argv[3]}`)
  if (typeof process.argv[2] !== 'undefined') {
    sourceDirectory = process.argv[2];
  }
  else {
/*    rl.question(FIRST_QUESTION, (firstAnswer) => {
      sourceDirectory = firstAnswer;
      rl.close();
    }); */

      sourceDirectory = rls.question(FIRST_QUESTION);

  }

  if (checkSourcePath(sourceDirectory) == 0) {
    getKeepData();
  }
  else {
    return;
  }

  if (typeof process.argv[3] !== 'undefined') {
    destinationDirectory = process.argv[3];
  }
  else {
/*    rl.question(SECOND_QUESTION, (secondAnswer) => {
      destinationDirectory = secondAnswer;
      rl.close();
    }); */
    destinationDirectory = rls.question(SECOND_QUESTION);
  }

  if (checkDestPath(destinationDirectory) == 0) {
    convertData();
  }
  else {
    return;
  }

}
  
main();
const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const convertFile = require("./convertFile.js");
const createOrReturnDirectory = require("./createOrReturnDirectory.js");

const rl = readline.createInterface({ input, output });

const FIRST_QUESTION =
  " \n\x1b[1m\x1b[33mEnter the location of downloaded and unzipped 'Google Keep' Takeout folder?\x1b[0m \n\x1b[33m e.g. /Users/<your username>/desktop/\x1b[0m\n\n >";
const SECOND_QUESTION =
  " \n\x1b[1m\x1b[33mEnter location of your 'Journals' folder or press 'ENTER' if you want to create new 'journals' folder in current location\x1b[0m \n\x1b[33m e.g. /Users/<your username>/Documents/<Logseq Graph name>/\x1b[0m\n\n >";

let sourceDirectory;
let destinationDirectory;
let jsonFiles;

const runFirstQuestion = () => {
  rl.question(FIRST_QUESTION, (askedFolderLocation) => {
    sourceDirectory = path.normalize(`${askedFolderLocation}/Takeout/Keep/`);

    if (
      !fs.existsSync(sourceDirectory) ||
      !fs.statSync(sourceDirectory).isDirectory()
    ) {
      console.log(
        "\n\x1b[1m\x1b[31mTakeout folder not found! Please try again!\x1b[0m"
      );
      return runFirstQuestion();
    }

    try {
      const files = fs.readdirSync(sourceDirectory);

      jsonFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === ".json"
      );
      runSecondQuestion();
    } catch (error) {
      console.log("Error getting directory info");
    }
  });
};

const runSecondQuestion = () => {
  rl.question(SECOND_QUESTION, (askedDestinationLocation) => {
    destinationDirectory = path.normalize(askedDestinationLocation);

    if (
      !fs.existsSync(destinationDirectory) ||
      !fs.statSync(destinationDirectory).isDirectory()
    ) {
      console.log(
        "\n\x1b[1m\x1b[31mDestination location is not valid! Please try again!\x1b[0m"
      );
      return runSecondQuestion();
    }

    let processedFilesCount = 0;
    for (let file of jsonFiles) {
      try {
        const fileContent = fs.readFileSync(`${sourceDirectory}/${file}`);
        const jsonData = JSON.parse(fileContent);
        const { mdFileName, content } = convertFile(jsonData);

        const pathToAppend = createOrReturnDirectory(
          `${destinationDirectory}/journals/`
        );

        fs.appendFileSync(`${pathToAppend}/${mdFileName}`, content);
        processedFilesCount++;
      } catch (error) {
        console.error(error);
      }
    }
    console.log(
      `\n\x1b[92m All files processed. Total converted files: ${processedFilesCount}. \n Please look for newly created 'journals' folder in '${
        destinationDirectory === "." ? __dirname : destinationDirectory
      }' directory. \x1b[0m\n`
    );
    rl.close();
  });
};

runFirstQuestion();

// **18:45** [[quick capture]]: ![PXL_20230204_234526949](../assets/PXL_20230204_234526949.jpg){:height 86, :width 228}

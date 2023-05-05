const fs = require("node:fs");
const path = require("node:path");

const copyAssets = (sourceDir, destinationDir) => {
  // const sourceDir = "/Users/elgun/Desktop/folder1";
  // const destinationDir = "/Users/elgun/Desktop/folder2";

  const allFiles = fs.readdirSync(sourceDir);

  // fs.opendirSync(sourceDir);
  // fs.opendirSync(destinationDir);

  let sourcePath, destinationPath, writeStream, ext;
  let totalTransfers = 0;
  let completedTransfers = 0;
  for (let file of allFiles) {
    ext = path.extname(file).toLowerCase();

    if (ext === ".html" || ext === ".json") continue;

    sourcePath = path.normalize(`${sourceDir}/${file}`);

    const directoryExists = fs.existsSync(`${destinationDir}/assets`);

    if (!directoryExists) fs.mkdirSync(`${destinationDir}/assets`);

    destinationPath = path.normalize(`${destinationDir}/assets/${file}`);

    const readStream = fs.createReadStream(sourcePath);
    writeStream = fs.createWriteStream(destinationPath);

    readStream.pipe(writeStream);

    totalTransfers++;

    writeStream.on("close", () => {
      completedTransfers++;
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(
        `\x1b[1m\x1b[31m${completedTransfers}/${totalTransfers}\x1b[0m`
      );
      if (completedTransfers === totalTransfers) {
        console.log(
          "\n\x1b[92mAll attachments are moved from Takeout folder to Logseq Assets folder\x1b[0m\n"
        );
      }
    });
  }
};

// copyAssets();

module.exports = copyAssets;

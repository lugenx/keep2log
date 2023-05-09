const fs = require("node:fs");
const path = require("node:path");

const copyAssets = (sourceDir, destinationDir) => {
  const allFiles = fs.readdirSync(sourceDir);

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
        `\x1b[1m\x1b[31m${completedTransfers}/${totalTransfers} attachments transfered.\x1b[0m`
      );
      if (completedTransfers === totalTransfers) {
        console.log(
          "\n\x1b[92mTransfer completed. Attachments copied to Assets folder\x1b[0m\n"
        );
      }
    });
  }
};

module.exports = copyAssets;

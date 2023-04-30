const fs = require("node:fs");

const convertFile = (file) => {
  const date = new Date(file.createdTimestampUsec / 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }

  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");

  const logseqJournalFilename = `${year}_${month}_${day}.md`;

  const title = file.title;
  const text = file.textContent;

  const content = title
    ? `\n- **${title.trim()}** (${hours}:${minutes})  \n\t- ${text.replaceAll(
        /\n(.+)/g,
        "\n\t- $1"
      )}`
    : `\n- ${hours}:${minutes} \n\t- ${text.replaceAll(/\n(.+)/g, "\n\t- $1")}`;

  fs.appendFile(logseqJournalFilename, content, (err) => {
    if (err) {
      console.log("Error happened while writing the file");
    }
  });

  return;
};

module.exports = convertFile;

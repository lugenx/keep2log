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

  const mdFileName = `${year}_${month}_${day}.md`;

  const formatTitle = (title) => {
    return title ? `**${title.trim()}**` : "";
  };

  const formatText = (text) => {
    return text?.replaceAll(/\n(.+)/g, "\n\t- $1");
  };

  const formatAttachments = (attachments) => {
    if (!attachments) return "";
    let formatted = "";
    for (let attachment of attachments) {
      formatted += `\n![attc.](../assets/${attachment.filePath})`;
    }
    return formatted;
  };

  const formattedTitle = formatTitle(file.title);
  const formattedText = formatText(file.textContent);
  const formattedAttachments = formatAttachments(file.attachments);
  const timestamp = `${hours}:${minutes}`;

  const content = `\n- ${formattedTitle} (${timestamp}) \n\t- ${formattedText} \n\t- ${formattedAttachments}`;

  return { mdFileName, content };
};

module.exports = convertFile;

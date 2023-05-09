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

  const formatList = (list) => {
    const mappedList = list?.map((item) =>
      item.isChecked ? `DONE ${item.text}` : `TODO ${item.text}`
    );
    return mappedList?.join("\n\t- ");
  };

  const formatAttachments = (attachments) => {
    if (!attachments) return "";
    let formatted = "";
    for (let attachment of attachments) {
      formatted += `\n![attc.](../assets/${attachment.filePath})`;
    }
    return formatted;
  };

  const formatLabels = (labels) => {
    const mappedLabel = labels?.map((label) => `#[[${label.name}]]`);
    return mappedLabel?.join(" ");
  };

  const formattedTitle = formatTitle(file.title);
  const formattedText = formatText(file.textContent);
  const formattedList = formatList(file.listContent);
  const formattedAttachments = formatAttachments(file.attachments);
  const formattedLabels = formatLabels(file.labels);
  const timestamp = `${hours}:${minutes}`;

  const content = `\n- ${formattedTitle} (${timestamp}) ${
    formattedLabels || ""
  }\n\t- ${formattedText || formattedList || ""} \n\t- ${formattedAttachments}`;

  return { mdFileName, content };
};

module.exports = convertFile;

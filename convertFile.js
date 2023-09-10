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

  const formatTitle = (title) => {
    return title ? `**${title.trim()}**` : "";
  };

  const formatTextAnnoContent = (text, annotations) => {
    let formattedText = text?.replaceAll(/\n(.+)/g, "\n- $1")
    .replaceAll(/^-\s*•/gm, '\t-')
    .replaceAll(/^-\s+-/gm, '\t\t-');
    if (!annotations) return formattedText;
    let formattedAnnotationsStr = "";

    for (let annotation of annotations) {
      let formattedAnnotation = `\n[${annotation.title}](${annotation.url})`;

      if (text && text.includes(annotation.url)) {
        formattedText = formattedText.replace(
          annotation.url,
          formattedAnnotation
        );
      } else {
        formattedAnnotationsStr += formattedAnnotation;
      }
    }
    return `${formattedText} ${formattedAnnotationsStr}`;
  };

  const formatList = (list) => {
    const mappedList = list?.map((item) =>
      item.isChecked ? `DONE ${item.text}` : `TODO ${item.text}`
    );
    return mappedList?.join("\n- ");
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
    const mappedLabel = labels?.map((label) => `${label.name}, `);
    return mappedLabel;
  };

  const formattedTitle = formatTitle(file.title);
  const formattedTextAnnoContent = formatTextAnnoContent(
    file.textContent,
    file.annotations
  );
  const formattedList = formatList(file.listContent);
  const formattedAttachments = formatAttachments(file.attachments);
  const formattedLabels = formatLabels(file.labels);
  const timestamp = `${hours}:${minutes}`;

  const content = `timestamp:: ${day}.${month}.${year} ${timestamp}\ntags:: ${formattedLabels?.join("") ?? ""}from-keep-2023\n- ${
    formattedTextAnnoContent || formattedList || ""
  } \n\t- ${formattedAttachments}`;

  const mdFileName = `${file.title.replaceAll('/', '___')}.md`;

  return { mdFileName, content };
};

module.exports = convertFile;

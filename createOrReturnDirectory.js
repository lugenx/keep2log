const createOrReturnDirectory = (pathToCreate) => {
  const fs = require("node:fs");
  const path = require("node:path");

  const normalizedPath = path.normalize(pathToCreate);

  if (fs.existsSync(normalizedPath)) return normalizedPath;

  try {
    createdPath = fs.mkdirSync(pathToCreate, { recursive: true });
    return normalizedPath;
  } catch (error) {
    console.log("Error in createPath ", error);
  }
};

module.exports = createOrReturnDirectory;

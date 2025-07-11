const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "build");

function traverseDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      traverseDirectory(filePath);
    } else if (path.extname(filePath) === ".js") {
      replaceStringInFile(filePath);
    }
  });
}

function replaceStringInFile(filePath) {
  let fileContent = fs.readFileSync(filePath, "utf8");
  if (!fileContent.includes("shared/types")) return;
  const updatedContent = fileContent.replace(/shared\/types/g, "shared/dist/types");
  fs.writeFileSync(filePath, updatedContent, "utf8");
  console.log(`Updated: ${filePath}`);
}

traverseDirectory(buildDir);

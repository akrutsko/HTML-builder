const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const { pipeline } = require('stream/promises');

const sourceDir = path.join(__dirname, 'styles');
const destinationDir = path.join(__dirname, 'project-dist');
const bundleFile = path.join(destinationDir, 'bundle.css');

async function createBundle() {
  await fsPromises.rm(bundleFile, { force: true });

  const files = await fsPromises.readdir(sourceDir, { withFileTypes: true });
  const cssFiles = files.filter((file) => path.extname(file.name) === '.css');

  for (const file of cssFiles) {
    const sourceFile = path.join(sourceDir, file.name);
    const rs = fs.createReadStream(sourceFile, 'utf-8');
    const ws = fs.createWriteStream(bundleFile, {
      encoding: 'utf-8',
      flags: 'a',
    });
    await pipeline(rs, ws);
  }
}

createBundle();

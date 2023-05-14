const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const { pipeline } = require('stream/promises');

const assets = 'assets';
const components = 'components';
const styles = 'styles';
const template = 'template.html';

const sourceAssets = path.join(__dirname, assets);
const sourceComponents = path.join(__dirname, components);
const sourceStyles = path.join(__dirname, styles);
const templateFile = path.join(__dirname, template);

const projectPath = path.join(__dirname, 'project-dist');
const indexFile = path.join(projectPath, 'index.html');
const bundleFile = path.join(projectPath, 'style.css');
const destinationAssets = path.join(projectPath, assets);

async function syncFiles(sourcePath, destinationPath) {
  await fsPromises.mkdir(destinationPath, { recursive: true });
  const files = await fsPromises.readdir(sourcePath, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isFile()) {
      fsPromises.copyFile(
        path.join(sourcePath, file.name),
        path.join(destinationPath, file.name)
      );
    } else {
      syncFiles(
        path.join(sourcePath, file.name),
        path.join(destinationPath, file.name)
      );
    }
  });
}

async function composeBundle(cssPath, bundleFile) {
  await fsPromises.rm(bundleFile, { force: true });

  const files = await fsPromises.readdir(cssPath, { withFileTypes: true });
  const cssFiles = files.filter((file) => path.extname(file.name) === '.css');

  for (const file of cssFiles) {
    const sourceFile = path.join(cssPath, file.name);
    const rs = fs.createReadStream(sourceFile, 'utf-8');
    const ws = fs.createWriteStream(bundleFile, {
      encoding: 'utf-8',
      flags: 'a',
    });
    await pipeline(rs, ws);
  }
}

async function parseTemplate(templateFile, componentsPath, indexFile) {
  let template = await fsPromises.readFile(templateFile, 'utf-8');
  const markers = template.match(/{{\w+}}/g);

  const componentFiles = markers.map((marker) =>
    fsPromises.readFile(
      path.join(componentsPath, `${marker.match(/\w+/g)}.html`),
      'utf-8'
    )
  );
  const components = await Promise.all(componentFiles);

  markers.forEach(
    (marker, i) => (template = template.replace(marker, components[i]))
  );
  fsPromises.writeFile(indexFile, template, 'utf-8');
}

(async () => {
  await fsPromises.rm(projectPath, { recursive: true, force: true });
  await fsPromises.mkdir(projectPath, { recursive: true });
  syncFiles(sourceAssets, destinationAssets);
  composeBundle(sourceStyles, bundleFile);
  parseTemplate(templateFile, sourceComponents, indexFile);
})();

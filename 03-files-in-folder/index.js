const path = require('path');
const fs = require('fs');
const { stdout } = process;

const pathToFolder = path.join(__dirname, 'secret-folder');
const rdOptions = { withFileTypes: true };

fs.readdir(pathToFolder, rdOptions, (err, files) => {
  if (err) throw err;
  files
    .filter(file => file.isFile())
    .forEach(file => {
      const { name, ext } = path.parse(file.name);

      fs.stat(path.join(pathToFolder, file.name), (err, stats) => {
        if (err) throw err;
        const size = (stats.size / 1024).toFixed(3) + 'kb';
        stdout.write(`${name} - ${ext.slice(1)} - ${size}\n`);
      });
    });
});

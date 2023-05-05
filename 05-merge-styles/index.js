const path = require('path');
const fs = require('fs');

const sourceDir = path.join(__dirname, 'styles');
const destinationDir = path.join(__dirname, 'project-dist');
const bundleFile = path.join(destinationDir, 'bundle.css');

fs.writeFile(bundleFile, '', err => {
  if (err) throw err;

  fs.readdir(sourceDir, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    const cssFiles = files.filter(file => path.extname(file.name) === '.css');

    cssFiles.forEach(file => {
      fs.readFile(path.join(sourceDir, file.name), (err, data) => {
        if (err) throw err;

        fs.appendFile(bundleFile, data, err => {
          if (err) throw err;
        });
      });
    });
  });
});

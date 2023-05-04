const path = require('path');
const fs = require('fs');

const pathFrom = path.join(__dirname, 'files');
const pathTo = path.join(__dirname, 'files-copy');

fs.mkdir(pathTo, { recursive: true }, (err) => {
  if (err) throw err;
  fs.readdir(pathFrom, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files
      .filter((file) => file.isFile())
      .forEach((file) => {
        const fileFrom = path.join(pathFrom, file.name);
        const fileTo = path.join(pathTo, file.name);

        fs.copyFile(fileFrom, fileTo, (err) => {
          if (err) throw err;
        });
      });
  });

  fs.readdir(pathTo, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const fileFrom = path.join(pathFrom, file.name);
      const fileTo = path.join(pathTo, file.name);

      fs.access(fileFrom, fs.constants.F_OK, (err) => {
        if (err) {
          fs.rm(fileTo, (err) => {
            if (err) throw err;
          });
        }
      });
    });
  });
});

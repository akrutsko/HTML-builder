const { stdout, stderr } = process;
const path = require('path');
const fs = require('fs');

const pathToFile = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(pathToFile, 'utf-8');

let data = '';
readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => stdout.write(data));
readableStream.on('error', error => stderr.write(error.message));

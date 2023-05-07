const path = require('path');
const fs = require('fs');
const readline = require('readline');
const os = require('os');

const pathToFile = path.join(__dirname, 'output.txt');
const file = fs.createWriteStream(pathToFile, 'utf-8');

// clear console
process.stdout.write('\033c');

const rl = readline.createInterface(process.stdin, process.stdout);

rl.write(`Please enter some text:${os.EOL}`);

rl.on('line', input => input === 'exit' ? rl.close() : file.write(`${input}${os.EOL}`));
rl.on('close', () => process.stdout.write('Bye!'));

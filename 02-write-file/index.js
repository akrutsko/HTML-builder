const path = require('path');
const fs = require('fs');
const readline = require('readline');

const pathToFile = path.join(__dirname, 'output.txt');
const file = fs.createWriteStream(pathToFile, 'utf-8');

// clear console
process.stdout.write('\033c');

// const { stdin: input, stdout: output } = process;
const rl = readline.createInterface(process.stdin, process.stdout);

rl.write('Please enter some text:\n');

rl.on('line', input => input === 'exit' ? rl.close() : file.write(`${input}\n`));
rl.on('close', () => process.stdout.write('Bye!'));

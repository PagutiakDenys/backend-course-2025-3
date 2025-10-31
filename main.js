#!/usr/bin/env node

const fs = require('fs');
const { Command } = require('commander');

const program = new Command();

program
  .requiredOption('-i, --input <file>', 'Input JSON file')
  .option('-o, --output <file>', 'Output file')
  .option('-d, --display', 'Display result in console')
  .option('-f, --furnished', 'Show only furnished houses')
  .option('-p, --price <number>', 'Show only houses with price lower than specified one');

program.parse(process.argv);
const options = program.opts();

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

let data;
try {
  const raw = fs.readFileSync(options.input, 'utf-8');
  data = JSON.parse(raw);
} catch (err) {
  console.error('Error reading or parsing JSON file:', err.message);
  process.exit(1);
}

if (options.furnished) {
  data = data.filter(h => 
    h.furnishingstatus && h.furnishingstatus.toLowerCase() === 'furnished'
  );
}

if (options.price) {
  const maxPrice = parseFloat(options.price);
  if (isNaN(maxPrice)) {
    console.error('Invalid price value');
    process.exit(1);
  }
  data = data.filter(h => h.price < maxPrice);
}

const result = data.map(h => {
  let line = `${h.price} ${h.area}`;
  if (options.furnished) {
    line += ' furnished';
  }
  return line;
}).join('\n');

if (options.display) console.log(result);

if (options.output) {
  fs.writeFileSync(options.output, result, 'utf-8');
}

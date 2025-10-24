#!/usr/bin/env node

const fs = require('fs');
const { Command } = require('commander');

const program = new Command();

program
  .option('-i, --input <file>', 'Input JSON file')
  .option('-o, --output <file>', 'Output file')
  .option('-d, --display', 'Display result in console')
  .option('-f, --furnished', 'show only houses with furniture')
  .option('-p, --price', 'show only houses with a price lower than the specified one');

program.parse(process.argv);

const options = program.opts();

// Перевірка обов'язкового параметра
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Перевірка наявності файлу
if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

// Читання JSON-файлу
let data;
try {
  const raw = fs.readFileSync(options.input, 'utf-8');
  data = JSON.parse(raw);
} catch (err) {
  console.error('Error reading or parsing JSON file:', err.message);
  process.exit(1);
}

// Конвертація JSON у рядок для виводу
const result = JSON.stringify(data, null, 2);

// Вивід у консоль
if (options.display) {
  console.log(result);
}

// Запис у файл
if (options.output) {
  fs.writeFileSync(options.output, result, 'utf-8');
}

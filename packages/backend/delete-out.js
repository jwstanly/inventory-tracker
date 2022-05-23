const fs = require('fs');
const path = require('path');

const typescriptOut = path.resolve(__dirname, 'out');
const samOut = path.resolve(__dirname, '.aws-sam');

deleteAll(typescriptOut, samOut);

async function deleteAll(...items) {
  await Promise.all(
    items.map((element) => fs.rmSync(element, { recursive: true, force: true }))
  );
}

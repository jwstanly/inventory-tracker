const tsj = require('ts-json-schema-generator');
const fs = require('fs');
const path = require('path');

const config = {
  path: path.resolve('../types.ts'),
  tsconfig: path.resolve('schema.tsconfig.json'),
  type: '*',
  encodeRefs: false,
};

const output_path = path.resolve(
  `${__dirname.split('packages')[0]}packages/backend/types.schema.json`
);

const schema = tsj.createGenerator(config).createSchema(config.type);

replaceRefs(schema.definitions);

const schemaString = JSON.stringify(schema, null, 2);

fs.writeFile(output_path, schemaString, (err) => {
  if (err) throw err;
});

function replaceRefs(object) {
  for (const property in object) {
    if (typeof object[property] === 'object') {
      if ('$ref' in object[property]) {
        const type = object[property]['$ref'].split('/').slice(-1);
        object[property] = schema.definitions[type];
      } else {
        replaceRefs(object[property]);
      }
    }
  }
}

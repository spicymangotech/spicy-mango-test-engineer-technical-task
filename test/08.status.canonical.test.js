const chai = require('chai');
const expect = chai.expect;
const { getSchema, runTransform } = require('./utils');

describe('8. Status field validation test:', () => {
  it('Each value for the "status" field must match the type defined in the schema (canonical check)', async () => {
    console.log('\n' + '='.repeat(48));

    const schema = await getSchema();
    const transformed = await runTransform();

    const fieldIndex = 4; // status is the 5th key in the schema
    const field = Object.keys(schema)[fieldIndex]; // get dynamically by index
    const allowedValues = schema[field]; // should be ["scheduled", "in_progress", "finished"]

    let canonicalPass = 0;
    let canonicalFail = 0;

transformed.forEach((obj, i) => {
  const output = obj[field]; // ❗ no normalization

  if (allowedValues.includes(output)) {
    canonicalPass++;
  } else {
    canonicalFail++;
    // console.log(`[Canonical FAIL] #${i} → got: "${output}"`);
  }
});


    const total = transformed.length;

    console.log(`\nField "${field}": Canonical schema validation`);
    console.log(`✓ Canonical Passed: ${canonicalPass}`);
    console.log(`✗ Canonical Failed: ${canonicalFail}`);
    console.log(`Total records: ${total}`);
    console.log('=========== Mocha’s default reporter ===================');

    if (canonicalFail > 0) {
      throw new Error(`${canonicalFail} records failed canonical schema validation for "${field}"`);
    }
  });
});

const chai = require('chai');
const expect = chai.expect;
const { getSchema, runTransform, getExtract } = require('./utils');

describe('8. Status field business logic test:', () => {
  it('If output is "in_progress", input must also be "in_progress"', async () => {
    console.log('\n' + '='.repeat(48));

    const schema = await getSchema();
    const transformed = await runTransform();
    const original = await getExtract();

    const fieldIndex = 4; // status is the 5th key in the schema
    const field = Object.keys(schema)[fieldIndex]; // dynamically get field name

    let logicPass = 0;
    let logicFail = 0;

    transformed.forEach((obj, i) => {
      const output = obj[field];
      const input = original[i]['state'];


      // Business Logic: if output is "in_progress", input must also be "in_progress"
      if (output === 'in_progress') {
        if (input === 'in_progress') {
          logicPass++;
        } else {
          logicFail++;
          // console.log(`[Logic FAIL] #${i} → output: "${output}" but input: "${input}"`);
        }
      }
    });

    const total = transformed.length;

    console.log(`\nField "${field}": Business Logic Validation`);
    console.log(`✓ Logic Passed: ${logicPass}`);
    console.log(`✗ Logic Failed: ${logicFail}`);
    console.log(`Total records checked: ${total}`);
    console.log('=========== Mocha’s default reporter ===================');

    if (logicFail > 0) {
      throw new Error(`${logicFail} records failed business logic validation for "${field}"`);
    }
  });
});

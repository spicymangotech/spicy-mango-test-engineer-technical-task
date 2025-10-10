const chai = require('chai');
const expect = chai.expect;
const { getSchema, runTransform } = require('./utils');

describe('4. ID type validation test:', () => {
  it('Each value for the "id" field must match the type defined in the schema', async () => {
    console.log('\n' + '='.repeat(48));

    const schema = await getSchema();
    const transformed = await runTransform();

    const fieldName = Object.keys(schema)[0]; // dynamically get "id"
    const expectedType = schema[fieldName];   // e.g. "string"

    const isValidType = (value, expectedTypeStr) => {
      const allowedTypes = expectedTypeStr.split('|');

      if (value === null) {
        return allowedTypes.includes('null');
      }

      const actualType = typeof value;
      return allowedTypes.includes(actualType);
    };

    let pass = 0;
    let fail = 0;

    transformed.forEach(obj => {
      if (isValidType(obj[fieldName], expectedType)) pass++;
      else fail++;
    });

    const total = pass + fail;

    console.log(`\nID type check: "${expectedType}"`);
    console.log(`✓ Passed: ${pass}`);
    console.log(`✗ Failed: ${fail}`);
    console.log(`Total checks: ${total}`);
    console.log('=========== Mocha’s default reporter ===================');

    if (fail > 0) {
      throw new Error(`${fail} items have invalid type for "${fieldName}" (expected: ${expectedType})`);
    }
  });
});

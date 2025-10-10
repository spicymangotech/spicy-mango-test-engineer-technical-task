const chai = require('chai');
const expect = chai.expect;
const { getSchema, runTransform } = require('./utils');

describe('6. Team fields type validation test:', () => {
  it('Each value for "homeTeam" and "awayTeam" must match their types in the schema', async () => {
    console.log('\n' + '='.repeat(48));

    const schema = await getSchema();
    const transformed = await runTransform();

    const schemaKeys = Object.keys(schema);
    const homeField = schemaKeys[1]; // "homeTeam"
    const awayField = schemaKeys[2]; // "awayTeam"
    const expectedHomeType = schema[homeField]; // e.g. "string|null"
    const expectedAwayType = schema[awayField];

    const isValidType = (value, expectedTypeStr) => {
      const allowedTypes = expectedTypeStr.split('|');
      if (value === null) return allowedTypes.includes('null');
      return allowedTypes.includes(typeof value);
    };

    let passHome = 0, failHome = 0;
    let passAway = 0, failAway = 0;

    transformed.forEach(obj => {
      if (isValidType(obj[homeField], expectedHomeType)) passHome++;
      else failHome++;

      if (isValidType(obj[awayField], expectedAwayType)) passAway++;
      else failAway++;
    });

    const total = transformed.length;

    console.log(`\nHomeTeam type check: "${expectedHomeType}"`);
    console.log(`✓ Passed: ${passHome}`);
    console.log(`✗ Failed: ${failHome}`);

    console.log(`\nAwayTeam type check: "${expectedAwayType}"`);
    console.log(`✓ Passed: ${passAway}`);
    console.log(`✗ Failed: ${failAway}`);

    console.log(`Total items: ${total * 2}`);
    console.log('=========== Mocha’s default reporter ===================');

    if (failHome > 0 || failAway > 0) {
      throw new Error(`Failed type checks — homeTeam: ${failHome}, awayTeam: ${failAway}`);
    }
  });
});

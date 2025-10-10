const chai = require('chai');
const expect = chai.expect;
const { getSchema, runTransform } = require('./utils');

describe('3. ID field presence test:', () => {
    it('Each item in the result must include the "id" field (from schema)', async () => {
        console.log('\n' + '='.repeat(48));

        const schema = await getSchema();
        const transformed = await runTransform();

        const schemaKeys = Object.keys(schema);
        const fieldName = schemaKeys[0]; // dynamically get "id"

        let pass = 0;
        let fail = 0;

        transformed.forEach(obj => {
            if (obj.hasOwnProperty(fieldName)) pass++;
            else fail++;
        });

        const total = pass + fail;

        console.log(`\nField check: "${fieldName}"`);
        console.log(`✓ Passed: ${pass}`);
        console.log(`✗ Failed: ${fail}`);
        console.log(`Total checks: ${total}`);
        console.log('=========== Mocha’s default reporter ===================');

        expect(fail, `Missing field "${fieldName}" in some items`).to.equal(0);
    });
});

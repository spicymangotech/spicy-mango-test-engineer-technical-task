const chai = require('chai');
const expect = chai.expect;
const { runTransform } = require('./utils');

describe('5. ID format and duplication test:', () => {
  it('IDs must be unique, must not contain "null", and must not be "match-" only', async () => {
    console.log('\n' + '='.repeat(48));

    const transformed = await runTransform();
    const ids = transformed.map(obj => obj.id);

    let duplicateCount = 0;
    let nullSubstringCount = 0;
    let invalidMatchFormatCount = 0;

    const seen = new Set();

    ids.forEach(id => {
      if (seen.has(id)) duplicateCount++;
      else seen.add(id);

      if (typeof id === 'string') {
        if (id.includes('null')) nullSubstringCount++;
        if (id === 'match-') invalidMatchFormatCount++;
      }
    });

    const total = ids.length;

    console.log(`\nTotal IDs: ${total}`);
    console.log(`✗ Duplicates: ${duplicateCount}`);
    console.log(`✗ IDs containing "null": ${nullSubstringCount}`);
    console.log(`✗ IDs equal to "match-": ${invalidMatchFormatCount}`);
    console.log('=========== Mocha’s default reporter ===================');

    expect(duplicateCount, 'Duplicate IDs found').to.equal(0);
    expect(nullSubstringCount, 'Some IDs contain "null"').to.equal(0);
    expect(invalidMatchFormatCount, 'Some IDs are just "match-"').to.equal(0);
  });
});

const { runTransform } = require('../lib/transform');

const idTests = require('../data/test-cases/test-id.json');
const idTransformed = runTransform(idTests.map(({ data }) => data))

test("result type check", () => {
    for (let i = 0; i < idTransformed.length; i++) {
        expect(typeof idTransformed[i].id).toBe("string");
    }
});

for (let i = 0; i < idTransformed.length; i++) {
    if (!idTransformed[i] || !idTests[i].test) {
        console.error(`Error: Missing test description or transformed data at index ${i}`);
        break;
    } else {
        const regex = /^match-\d{3}$/;
        test(idTests[i].test, () => {
            expect(idTransformed[i].id).toMatch(regex);
        });
    }
}

test('ID should be unique', () => {
    const ids = idTransformed.map(item => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
});
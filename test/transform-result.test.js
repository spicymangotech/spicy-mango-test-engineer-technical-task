const { runTransform } = require('../lib/transform');

const { cases } = require('../data/test-cases/test-result.json');
const transformed = runTransform(cases)

const scoreRegex = /^\d{1,2}-\d{1,2}$/;

test('Result type check', () => {
    for (let i = 0; i < transformed.length; i++) {
        expect(typeof transformed[i].score === "string" || transformed[i].score === null).toBeTruthy();
    }
});

test('should parse normal score', () => {
    for (let i = 0; i < 3; i++) {
        expect(transformed[i].score).toMatch(scoreRegex);
    }
});

test('should react to incomplete result', () => {
    expect(transformed[3].score).toBeNull();
});

test('should handle null result', () => {
    expect(transformed[4].score).toBeNull();
});

test('should handle wrong type', () => {
    expect(transformed[5].score).toBeNull().or().toMatch(scoreRegex);
});

test('should return null for future match', () => {
    expect(transformed[6].score).toBeNull();
});

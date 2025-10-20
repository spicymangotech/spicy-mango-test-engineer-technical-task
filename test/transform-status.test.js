const { runTransform } = require('../lib/transform');

const { cases } = require('../data/test-cases/test-status.json');
const transformed = runTransform(cases.map((c) => c.data));

const { status } = require('../expected/expected-schema.json');

test('Result type check', () => {
    for (let i = 0; i < transformed.length; i++) {
        expect(typeof transformed[i].status === "string" || transformed[i].status === null).toBeTruthy();
    }
});


test(cases[0].test, () => {
    expect(status).toContain(transformed[0].status);
    expect(transformed[0].status).toBe('finished');
});

test(cases[1].test, () => {
    expect(status).toContain(transformed[1].status);
    expect(transformed[1].status).toBe('scheduled');
});

test(cases[2].test, () => {
    expect(status).toContain(transformed[2].status);
    expect(transformed[2].status).toBe('in_progress');
});

test(cases[3].test, () => {
    expect(status).toContain(transformed[3].status);
    expect(transformed[3].status).toBe('finished');
});

test(cases[4].test, () => {
    expect(status).toContain(transformed[4].status);
    expect(transformed[4].status).toBe('finished');
});

test(cases[5].test, () => {
    expect(status).toContain(transformed[5].status);
    expect(transformed[5].status).toBe('in_progress');
});

test(cases[6].test, () => {
    expect(status).toContain(transformed[6].status);
    expect(transformed[6].status).toBe('in_progress');
});

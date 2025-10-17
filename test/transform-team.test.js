const { runTransform } = require('../lib/transform');

const { validTeamName, cases } = require('../data/test-cases/test-team.json');
const transformed = runTransform(cases.map(({ data }) => data))

test('Result type check', () => {
    for (let i = 0; i < transformed.length; i++) {
        const { homeTeam, awayTeam } = transformed[i]
        expect(typeof homeTeam).toBe("string");
        expect(typeof awayTeam).toBe("string");
    }
});

for (let i = 0; i < transformed.length; i++) {
    if (!transformed[i] || !cases[i].test) {
        console.error(`Error: Missing test description or transformed data at index ${i}`);
        break;
    } else {
        test(cases[i].test, () => {
            const { homeTeam, awayTeam } = transformed[i]
            expect(homeTeam).toBeTruthy();
            expect(validTeamName.includes(homeTeam)).toBeTruthy();
            expect(awayTeam).toBeTruthy();
            expect(validTeamName.includes(awayTeam)).toBeTruthy();

            expect(homeTeam.trim() != awayTeam.trim()).toBeTruthy();

            // ensure names contain only letters, numbers, spaces, or hyphens (no other special characters or emojis)
            expect(homeTeam).toMatch(/^[\p{L}\p{N} \-]+$/u);
            expect(awayTeam).toMatch(/^[\p{L}\p{N} \-]+$/u);
        });
    }
}
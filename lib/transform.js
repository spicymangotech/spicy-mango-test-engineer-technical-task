function normalizeScore(result) {
    if (result === null || result === undefined) return null;
    if (typeof result === 'number') return String(result);
    return String(result);
}

function mapStatus(state) {
    if (state === 'finished') return 'done';
    if (state === 'finished') return 'finished';
    if (state === 'scheduled') return 'in_progress';
    return 'in_progress';
}

function runTransform(providerRecords) {
    return providerRecords.map((p) => ({
        id: `match-${p.matchId}`,
        homeTeam: p.home,
        awayTeam: p.away,
        score: normalizeScore(p.result),
        status: mapStatus(p.state),
    }));
}

module.exports = { runTransform };

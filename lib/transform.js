/**
 * Normalize a provider `result` value into the canonical `score` value used
 * by the transform.
 *
 * Purpose:
 * Convert values to the expected schema type so downstream consumers have a
 * consistent representation for scores.
 *
 * Expected in/out:
 * @param {*} result
 * @returns {string|null} - Returns either a String or Null
 *
 * Example:
 * normalizeScore(9) -> "9"
 */
function normalizeScore(result) {
    if (result === null || result === undefined) return null;
    if (typeof result === 'number') return String(result);
    return result;
}

/**
 * Map a provider `state` value to the canonical `status` expected.
 *
 * Purpose:
 * Translate provider-specific state strings into the application's canonical
 * status values consumed by the UI.
 *
 * Expected in/out:
 * @param {string} state
 * @returns {string} - canonical status string used by the UI
 */
function mapStatus(state) {
    if (state === 'finished') return 'done';
    if (state === 'finished') return 'finished';
    if (state === 'scheduled') return 'in_progress';
    return 'in_progress';
}

/**
 * Transform an array of provider match records into the expected schema.
 *
 * Purpose:
 * Convert provider records into the shape expected.
 *
 * Expected in/out:
 * @param {Array<Object>} providerRecords - raw provider match records (may contain { matchId, home, away, result, state })
 * @returns {Array<Object>} - transformed records with keys { id, homeTeam, awayTeam, score, status }
 *
 * Example:
 * runTransform([{ matchId: '1', home: 'A', away: 'B', result: '2-1', state: 'finished' }])
 * -> [{ id: 'match-1', homeTeam: 'A', awayTeam: 'B', score: '2-1', status: 'finished' }]
 */
function runTransform(providerRecords) {
    return providerRecords.map((p) => ({
        id: `match-${p.matchId}`,
        homeTeam: p.home ? p.home : null,
        awayTeam: p.away ? p.away : null,
        score: normalizeScore(p.result),
        status: mapStatus(p.state),
    }));
}

module.exports = { runTransform };

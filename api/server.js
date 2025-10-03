// Express server providing mock APIs, static UI, and ETL transform endpoint
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { runTransform } = require('../lib/transform');

const extractData = require('../data/extract/provider-matches.json');
const expectedSchema = require('../expected/expected-schema.json');

const loadDir = path.join(__dirname, '../data/load');
const loadPath = path.join(loadDir, 'matches.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const reset = () => {
    fs.writeFileSync(loadPath, '[]');
};

reset();

// Serve UI statically
app.use('/', express.static(path.join(__dirname, '../ui')));

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Schema
app.get('/api/schema', (req, res) => res.json(expectedSchema));

app.delete('/api/reset', (req, res) => {
    reset();
    return res.status(200).json({ message: 'The transformed data has been reset.' });
});

// Extract data
app.get('/api/extract/matches', (req, res) => res.json(extractData));

// Load data (final output)
app.get('/api/load/matches', (req, res) => {
    try {
        const loadPath = path.join(__dirname, '../data/load/matches.json');
        if (fs.existsSync(loadPath)) {
            const loadData = JSON.parse(fs.readFileSync(loadPath, 'utf8'));
            return res.json(loadData);
        } else {
            return res.status(404).json({ error: 'No transformed data found. Run transform first.' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Failed to read load data', details: String(err) });
    }
});

// Run transform from extract -> load (in-memory demo + file output)
app.post('/api/transform/run', (req, res) => {
    try {
        // Run the transform
        const result = runTransform(extractData);

        // Ensure load directory exists

        if (!fs.existsSync(loadDir)) {
            fs.mkdirSync(loadDir, { recursive: true });
        }

        // Write to load file
        fs.writeFileSync(loadPath, JSON.stringify(result, null, 2), 'utf8');

        return res.json({
            count: result.length,
            data: result,
            message: `Data transformed and saved to ${loadPath}`,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Transform failed', details: String(err) });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
    console.log(`UI available at http://localhost:${PORT}/index.html`);
    console.log(`API endpoints:`);
    console.log(`  GET  /api/extract/matches - Raw provider data`);
    console.log(`  POST /api/transform/run   - Run ETL transform`);
    console.log(`  GET  /api/load/matches    - Final transformed data`);
});

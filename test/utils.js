const request = require('supertest');
const baseUrl = 'http://localhost:4000';

async function resetLoad() {
  return await request(baseUrl).delete('/api/reset');
}

async function getSchema() {
  const res = await request(baseUrl).get('/api/schema');
  return res.body;
}

async function getExtract() {
  const res = await request(baseUrl).get('/api/extract/matches');
  return res.body;
}

async function runTransform() {
  const res = await request(baseUrl).post('/api/transform/run');
  if (res.status !== 200) throw new Error('Transform failed');
  return res.body.data;
}

async function getLoad() {
  const res = await request(baseUrl).get('/api/load/matches');
  if (res.status !== 200) throw new Error('Load failed');
  return res.body;
}

async function checkHealth() {
  const res = await request(baseUrl).get('/api/health');
  return res.body;
}

// Shortcut combo (full ETL like before)
async function runETL() {
  await resetLoad();
  const schema = await getSchema();
  const extract = await getExtract();
  const transformed = await runTransform();
  const loaded = await getLoad();
  return { schema, extract, transformed, loaded };
}

module.exports = {
  runETL,       // for full flow
  resetLoad,
  getSchema,
  getExtract,
  runTransform,
  getLoad,
  checkHealth
};
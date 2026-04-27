const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });

const fetchLogs = async () => {
  const result = await client.search({
    index: 'logs-*', // Aapke Linux logs ka index pattern [cite: 52]
    query: { match_all: {} },
    size: 100
  });
  return result.hits.hits.map(hit => hit._source);
};

module.exports = { fetchLogs };
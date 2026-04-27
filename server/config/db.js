const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

// Initialize Elasticsearch Client 
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    // Agar aapne authentication enable kiya hai toh yahan username/password aayega
    username: process.env.ELASTIC_USERNAME || 'elastic',
    password: process.env.ELASTIC_PASSWORD || ''
  }
});

// Function to test connection
const connectDB = async () => {
  try {
    await esClient.ping();
    console.log('✅ Elasticsearch connected successfully');
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { esClient, connectDB };
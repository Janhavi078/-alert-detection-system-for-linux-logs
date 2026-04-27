const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

// Initialize Elasticsearch Client 
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTIC_USERNAME || 'elastic',
    password: process.env.ELASTIC_PASSWORD || ''
  },
  tls: {
    // Local development mein self-signed certificate errors ko ignore karne ke liye 
    rejectUnauthorized: false 
  }
});

// Function to test connection [cite: 134]
const connectDB = async () => {
  try {
    // Ping check to verify if the server is reachable [cite: 135]
    await esClient.ping();
    console.log('✅ Elasticsearch connected successfully');
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:', error.message);
    
    // Pro-Tip: Skip process.exit(1) if you want the server to keep running even if ES is down
    console.log('⚠️ Continuing server execution without Elasticsearch...');
  }
};

module.exports = { esClient, connectDB };
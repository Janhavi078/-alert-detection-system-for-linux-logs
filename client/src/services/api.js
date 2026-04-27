import axios from 'axios';

// Create an instance with your Node.js Backend URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const logService = {
  // Fetch logs retrieved from Elasticsearch [cite: 26, 59]
  getLogs: () => API.get('/logs'),
  
  // Trigger ML analysis on specific logs [cite: 85, 86]
  analyzeLogs: (logData) => API.post('/analyze', { logs: logData }),
  
  // Get detected anomalies/alerts [cite: 62, 89]
  getAlerts: () => API.get('/alerts'),
  
  // Get dashboard statistics [cite: 91]
  getStats: () => API.get('/stats'),
};

export default API;
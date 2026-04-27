const axios = require('axios');

/**
 * Sends logs to the Python ML service for anomaly detection [cite: 60, 132]
 * @param {Array} logs - Raw log data from Elasticsearch [cite: 26, 59]
 * @returns {Promise<Array>} - List of detected anomalies [cite: 72, 74]
 */
exports.analyzeLogsWithML = async (logs) => {
    try {
        const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000/detect";
        
        // POST request to Python FastAPI [cite: 93, 133]
        const response = await axios.post(ML_URL, { logs });
        
        // Return structured results: anomaly, score, reason [cite: 68, 70, 71]
        return response.data.results;
    } catch (error) {
        console.error("ML Service Connection Error:", error.message);
        throw error;
    }
};
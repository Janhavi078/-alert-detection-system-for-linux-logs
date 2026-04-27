const { esClient } = require('../config/db');
const { analyzeLogsWithML } = require('../services/mlService');

// @desc    Fetch all logs from Elasticsearch
// @route   GET /api/logs [cite: 84]
exports.getLogs = async (req, res) => {
    try {
        const { body } = await esClient.search({
            index: 'linux-logs-*',
            body: {
                query: { match_all: {} },
                sort: [{ "@timestamp": "desc" }]
            }
        });
        res.status(200).json(body.hits.hits.map(hit => hit._source));
    } catch (error) {
        res.status(500).json({ message: "Error fetching logs", error: error.message });
    }
};

// @desc    Analyze logs using Python ML Service
// @route   POST /api/analyze [cite: 86]
exports.analyzeLogs = async (req, res) => {
    try {
        const { logs } = req.body; // Logs passed from frontend [cite: 97]
        if (!logs || logs.length === 0) {
            return res.status(400).json({ message: "No logs provided for analysis" });
        }

        // Call the ML Service bridge [cite: 87]
        const analysisResults = await analyzeLogsWithML(logs);
        
        // Return detected anomalies to frontend [cite: 28, 74]
        res.status(200).json({
            status: "Success",
            results: analysisResults
        });
    } catch (error) {
        res.status(500).json({ message: "ML Analysis failed", error: error.message });
    }
};
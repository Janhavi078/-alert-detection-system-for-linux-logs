const { esClient } = require('../config/db');

// @desc    Get all detected alerts/anomalies
// @route   GET /api/alerts [cite: 89]
exports.getAlerts = async (req, res) => {
    try {
        // Fetch logs that were marked as anomalies (threshold/flag based)
        const { body } = await esClient.search({
            index: 'alerts-index', 
            body: {
                query: { term: { is_anomaly: true } }
            }
        });
        res.status(200).json(body.hits.hits.map(hit => hit._source));
    } catch (error) {
        res.status(500).json({ message: "Error fetching alerts", error: error.message });
    }
};

// @desc    Get dashboard summary statistics
// @route   GET /api/stats [cite: 91]
exports.getStats = async (req, res) => {
    try {
        // Logic to count total logs vs anomalies for Dashboard [cite: 77, 90]
        const stats = {
            totalLogs: 1500, // Placeholder for actual ES aggregation
            totalAlerts: 45,
            systemStatus: "Healthy" [cite: 157]
        };
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};
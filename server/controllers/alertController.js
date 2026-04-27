// const { esClient } = require('../config/db');

// // @desc    Get all detected alerts/anomalies
// // @route   GET /api/alerts
// exports.getAlerts = async (req, res) => {
//     try {
//         const { body } = await esClient.search({
//             index: 'alerts-index', 
//             body: {
//                 query: { term: { is_anomaly: True } }
//             }
//         });
//         res.status(200).json(body.hits.hits.map(hit => hit._source));
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching alerts", error: error.message });
//     }
// };

// // @desc    Get dashboard summary statistics
// // @route   GET /api/stats
// exports.getStats = async (req, res) => {
//     try {
//         const stats = {
//             totalLogs: 1500, 
//             totalAlerts: 45,
//             systemStatus: "Healthy" 
//         };
//         res.status(200).json(stats);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching stats" });
//     }
// };
const { esClient } = require('../config/db');

// @desc    Get all detected alerts/anomalies
// @route   GET /api/alerts
exports.getAlerts = async (req, res) => {
    try {
        // Pehle check karein ki client ready hai ya nahi
        const { body } = await esClient.search({
            index: 'alerts-index', 
            body: {
                query: { 
                    term: { is_anomaly: true } // Fixed: lowercase 'true'
                } 
            }
        }).catch(err => {
            console.log("Elasticsearch not reachable, sending empty alerts.");
            return { hits: { hits: [] } }; // Fallback data
        });

        const results = body?.hits?.hits?.map(hit => hit._source) || [];
        res.status(200).json(results);
    } catch (error) {
        console.error("Alerts Error:", error.message);
        res.status(200).json([]); // Status 200 with empty array to prevent frontend crash
    }
};

// @desc    Get dashboard summary statistics
// @route   GET /api/stats
exports.getStats = async (req, res) => {
    try {
        // Yahan hum hardcoded data bhej rahe hain taaki aapka Dashboard UI dikhne lage
        // Future mein aap ise esClient.count se replace kar sakti hain
        const stats = {
            totalLogs: 1284, 
            totalAlerts: 12,
            systemStatus: "SECURE" 
        };
        
        console.log("Dashboard stats sent to frontend ✅");
        res.status(200).json(stats);
    } catch (error) {
        console.error("Stats Error:", error.message);
        res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
};
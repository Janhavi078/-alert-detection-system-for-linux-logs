// @desc    Get dashboard summary statistics
// @route   GET /api/stats
exports.getStats = async (req, res) => {
    try {
        // Logic to count total logs vs anomalies for Dashboard
        const stats = {
            totalLogs: 1500, // Placeholder data
            totalAlerts: 45,
            systemStatus: "Healthy" // Citation hata diya gaya hai
        };
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};